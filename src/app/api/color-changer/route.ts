import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Replicate from 'replicate'
import { checkAndEnforceLimit, incrementUsage, logGeneration } from '@/lib/usage-tracker'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    let userId: string | null = null

    try {
        const cookieStore = await cookies()
        const supabase = createServerComponentClient({ cookies: () => cookieStore })
        const { data: { user } } = await supabase.auth.getUser()

        // Allow guest or require auth? Pattern so far is guest fallback or null check.
        // Existing code checked auth.
        userId = user?.id || 'guest_user'

        // Check limits
        const limitCheck = await checkAndEnforceLimit(userId, 'image')
        if (!limitCheck.allowed) {
            return NextResponse.json({ error: limitCheck.reason || 'Usage limit exceeded' }, { status: 429 })
        }

        const formData = await request.formData()
        const imageFile = formData.get('image') as File
        const color = formData.get('color') as string || 'red'
        const prompt = `Change the object color to ${color}`

        const replicateApiKey = process.env.REPLICATE_API_TOKEN
        const replicate = new Replicate({ auth: replicateApiKey })

        const bytes = await imageFile.arrayBuffer()
        const base64Image = Buffer.from(bytes).toString('base64')
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`

        const prediction = await replicate.predictions.create({
            version: "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f", // InstructPix2Pix
            input: {
                image: dataUrl,
                prompt: prompt,
                image_guidance_scale: 1.5,
            }
        })

        let completed = prediction
        let pollCount = 0
        while (completed.status !== 'succeeded' && completed.status !== 'failed' && pollCount < 40) {
            await new Promise(r => setTimeout(r, 1000))
            completed = await replicate.predictions.get(prediction.id)
            pollCount++
        }

        if (completed.status !== 'succeeded') throw new Error('Processing failed')

        const outputUrl = Array.isArray(completed.output) ? completed.output[0] : completed.output
        const res = await fetch(outputUrl)
        const blob = await res.arrayBuffer()
        const base64Result = Buffer.from(blob).toString('base64')

        // Log generation
        const generationId = await logGeneration({
            userId,
            tool: 'color_changer',
            inputUrl: 'image_upload', // truncate or store elsewhere
            outputUrl: outputUrl,
            inputMetadata: { prompt, color },
            outputMetadata: { outputUrl },
            costUsd: 0.02
        })

        await incrementUsage(userId, 'image')

        return NextResponse.json({
            success: true,
            image: `data:image/png;base64,${base64Result}`,
            generationId
        })

    } catch (error) {
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
}
