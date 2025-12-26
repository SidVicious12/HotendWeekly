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

        userId = user?.id || 'guest_user'

        // Check limits (Scene Quota)
        const limitCheck = await checkAndEnforceLimit(userId, 'scene');
        if (!limitCheck.allowed) {
            return NextResponse.json({ error: limitCheck.reason || 'Usage limit exceeded' }, { status: 429 })
        }

        const formData = await request.formData()
        const description = formData.get('description') as string
        const imageFile = formData.get('image') as File | null

        const replicateApiKey = process.env.REPLICATE_API_TOKEN
        const replicate = new Replicate({ auth: replicateApiKey })

        let outputUrl

        if (imageFile) {
            // Img2Img workflow
            const bytes = await imageFile.arrayBuffer()
            const base64Image = Buffer.from(bytes).toString('base64')
            const dataUrl = `data:${imageFile.type};base64,${base64Image}`

            const prediction = await replicate.predictions.create({
                version: "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f", // InstructPix2Pix
                input: {
                    image: dataUrl,
                    prompt: `place this object in a realistic lifestyle scene: ${description || 'modern desk setup'}`,
                    image_guidance_scale: 1.2,
                }
            })
            // Poll...
            let completed = prediction
            let pollCount = 0
            while (completed.status !== 'succeeded' && completed.status !== 'failed' && pollCount < 40) {
                await new Promise(r => setTimeout(r, 1000))
                completed = await replicate.predictions.get(prediction.id)
                pollCount++
            }
            if (completed.status !== 'succeeded') throw new Error('Generation failed')
            outputUrl = Array.isArray(completed.output) ? completed.output[0] : completed.output

        } else {
            // Txt2Img workflow
            const prediction = await replicate.predictions.create({
                version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL
                input: {
                    prompt: `A 3D printed ${description} in a realistic lifestyle photography setting, high quality, 4k`,
                }
            })
            // Poll...
            let completed = prediction
            let pollCount = 0
            while (completed.status !== 'succeeded' && completed.status !== 'failed' && pollCount < 40) {
                await new Promise(r => setTimeout(r, 1000))
                completed = await replicate.predictions.get(prediction.id)
                pollCount++
            }
            if (completed.status !== 'succeeded') throw new Error('Generation failed')
            outputUrl = Array.isArray(completed.output) ? completed.output[0] : completed.output
        }

        // Fetch and convert (keeping this legacy behavior for now as frontend expects base64)
        const res = await fetch(outputUrl)
        const blob = await res.arrayBuffer()
        const base64Result = Buffer.from(blob).toString('base64')

        // Log generation
        const generationId = await logGeneration({
            userId,
            tool: 'scene_generator',
            inputUrl: imageFile ? 'image_upload' : 'text_prompt',
            outputUrl: outputUrl,
            inputMetadata: { description, mode: imageFile ? 'img2img' : 'txt2img' },
            outputMetadata: { outputUrl },
            costUsd: 0.02
        })

        // Increment usage
        await incrementUsage(userId, 'scene')

        return NextResponse.json({
            success: true,
            image: `data:image/png;base64,${base64Result}`,
            generationId
        })

    } catch (error) {
        console.error('Print Scene Generator Error:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
}
