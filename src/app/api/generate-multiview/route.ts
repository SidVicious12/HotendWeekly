import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export const dynamic = 'force-dynamic'

/**
 * Generate multi-view renders using Nano Banana for enhanced 3D reconstruction
 * Takes a single image and generates 2-3 different angle views
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const imageFile = formData.get('image') as File

        if (!imageFile) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        const replicateApiKey = process.env.REPLICATE_API_TOKEN
        if (!replicateApiKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const replicate = new Replicate({ auth: replicateApiKey })

        // Convert image to base64
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString('base64')
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`

        console.log('Generating multi-view renders with Nano Banana...')

        // Generate views using Nano Banana (Gemini-powered image generation)
        // We'll generate side and back views
        const viewPrompts = [
            { angle: 'front', prompt: 'Keep the exact same object, same lighting, same style. This is the front view.' },
            { angle: 'side', prompt: 'Render the same object from a 90-degree side view, maintaining exact proportions, colors, and details.' },
            { angle: 'back', prompt: 'Render the same object from the back view (180 degrees rotated), maintaining exact proportions, colors, and details.' },
        ]

        const views: { angle: string; imageUrl: string }[] = []

        // Add original as front view
        views.push({ angle: 'front', imageUrl: dataUrl })

        // Generate additional views
        for (const viewPrompt of viewPrompts.slice(1)) {
            try {
                // Using Nano Banana Pro on Replicate
                const output = await replicate.run(
                    "fofr/nano-banana:34dd7ab43a11e56c8e60ad3e8da73d8c3e6c9c6579ef27574c9a4c2cf87db34e",
                    {
                        input: {
                            image: dataUrl,
                            prompt: viewPrompt.prompt,
                            guidance_scale: 7.5,
                            num_inference_steps: 50
                        }
                    }
                )

                // Handle output - typically returns URL(s)
                let outputUrl = ''
                if (typeof output === 'string') {
                    outputUrl = output
                } else if (Array.isArray(output) && output.length > 0) {
                    outputUrl = output[0]
                } else if (typeof output === 'object' && output !== null) {
                    // @ts-ignore
                    outputUrl = output.output || output.image || output[0]
                }

                if (outputUrl) {
                    views.push({ angle: viewPrompt.angle, imageUrl: outputUrl })
                }
            } catch (viewError) {
                console.error(`Failed to generate ${viewPrompt.angle} view:`, viewError)
                // Continue with other views
            }
        }

        console.log(`Generated ${views.length} views`)

        return NextResponse.json({
            success: true,
            views,
            message: `Generated ${views.length} views for enhanced 3D reconstruction`
        })

    } catch (error) {
        console.error('Multi-view generation error:', error)
        return NextResponse.json(
            { error: 'Multi-view generation failed: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        )
    }
}
