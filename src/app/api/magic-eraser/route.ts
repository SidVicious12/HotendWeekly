import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Replicate from 'replicate'
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    let userId: string | null = null

    try {
        const cookieStore = await cookies()
        const supabase = createServerComponentClient({ cookies: () => cookieStore })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        userId = user?.id || null
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Check limits
        const limitCheck = await checkUsageLimit(user.id, 'magic-eraser')
        if (!limitCheck.allowed) {
            await incrementUsage(user.id, {
                toolName: 'magic-eraser',
                toolCategory: 'ai_tools',
                status: 'rate_limited',
                processingTimeMs: Date.now() - startTime,
            })
            return NextResponse.json({ error: 'Usage limit exceeded' }, { status: 429 })
        }

        const formData = await request.formData()
        const imageFile = formData.get('image') as File
        const prompt = formData.get('prompt') as string || 'remove the object'

        if (!imageFile) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

        const replicateApiKey = process.env.REPLICATE_API_TOKEN
        if (!replicateApiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })

        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString('base64')
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`

        const replicate = new Replicate({ auth: replicateApiKey })

        // Using InstructPix2Pix for text-based removal/editing
        const prediction = await replicate.predictions.create({
            version: "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f", // InstructPix2Pix
            input: {
                image: dataUrl,
                prompt: prompt,
                image_guidance_scale: 1.5,
            }
        })

        // Poll logic
        let completed = prediction
        let pollCount = 0
        while (completed.status !== 'succeeded' && completed.status !== 'failed' && pollCount < 40) {
            await new Promise(r => setTimeout(r, 1000))
            completed = await replicate.predictions.get(prediction.id)
            pollCount++
        }

        if (completed.status !== 'succeeded') throw new Error('Generation failed or timed out')

        const outputUrl = Array.isArray(completed.output) ? completed.output[0] : completed.output

        // Fetch and convert to base64
        const res = await fetch(outputUrl)
        const blob = await res.arrayBuffer()
        const base64Result = Buffer.from(blob).toString('base64')

        // Track usage
        await incrementUsage(user.id, {
            toolName: 'magic-eraser',
            toolCategory: 'ai_tools',
            processingTimeMs: Date.now() - startTime,
            status: 'success',
        })

        return NextResponse.json({
            success: true,
            image: `data:image/png;base64,${base64Result}`
        })

    } catch (error) {
        console.error('Magic Eraser error:', error)
        if (userId) await incrementUsage(userId, { toolName: 'magic-eraser', toolCategory: 'ai_tools', status: 'error', processingTimeMs: Date.now() - startTime })
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
}
