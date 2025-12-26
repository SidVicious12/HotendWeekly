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

        // For prototype, we might want to be lenient with auth, but sticking to pattern:
        // userId = user?.id || null
        // if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Allow unauthenticated usage for testing/demo
        userId = user?.id || 'guest_user'

        const limitCheck = await checkUsageLimit(userId, 'transform-to-3d')
        if (!limitCheck.allowed) {
            await incrementUsage(userId, {
                toolName: 'transform-to-3d',
                toolCategory: 'ai_tools',
                status: 'rate_limited',
                processingTimeMs: Date.now() - startTime,
            })
            return NextResponse.json({ error: 'Usage limit exceeded' }, { status: 429 })
        }

        const formData = await request.formData()
        const imageFile = formData.get('image') as File

        if (!imageFile) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

        const replicateApiKey = process.env.REPLICATE_API_TOKEN
        if (!replicateApiKey) {
            return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 })
        }
        const replicate = new Replicate({ auth: replicateApiKey })

        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString('base64')
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`

        // Get model selection from formData (default to trellis)
        const modelChoice = formData.get('model')?.toString() || 'trellis';

        console.log(`Sending request to Replicate (model: ${modelChoice})...`);

        let prediction;

        if (modelChoice === 'hunyuan') {
            // Hunyuan 3D 2.1
            prediction = await replicate.predictions.create({
                version: "4876f2a806b8c0a5e3eaa00b9acc5a3eb7fbd1c3e9f5dc3ab93d6f05a6d3f4d2",
                input: {
                    image: dataUrl,
                }
            });
        } else {
            // Default: Trellis
            prediction = await replicate.predictions.create({
                version: "e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c",
                input: {
                    images: [dataUrl],
                    generate_model: true,
                    ss_guidance_strength: 7.5,
                    slat_guidance_strength: 3,
                    texture_size: 1024,
                    mesh_simplify: 0.95
                }
            });
        }

        // Poll for completion
        let completed = prediction;
        let pollCount = 0;
        const maxPolls = 120; // 2 minutes max

        while (completed.status !== 'succeeded' && completed.status !== 'failed' && pollCount < maxPolls) {
            await new Promise(r => setTimeout(r, 1000));
            completed = await replicate.predictions.get(prediction.id);
            pollCount++;
            console.log(`Polling... status: ${completed.status}, poll: ${pollCount}`);
        }

        if (completed.status !== 'succeeded') {
            const errorMsg = typeof completed.error === 'string' ? completed.error : 'Generation timed out or failed';
            console.error('Generation failed:', errorMsg);
            throw new Error(errorMsg);
        }

        console.log('Replicate output:', JSON.stringify(completed.output, null, 2));

        // Extract model URL from output
        let outputUrl = '';
        const output = completed.output;

        if (typeof output === 'string') {
            outputUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            // Some models return array of URLs
            outputUrl = output.find((url: string) => url.endsWith('.glb') || url.endsWith('.gltf')) || output[0];
        } else if (typeof output === 'object' && output !== null) {
            // Trellis returns { model_file: "url", color_video: "url", ... }
            outputUrl = (output as any).model_file || (output as any).glb || (output as any).output_model || (output as any).mesh;
            // If still an object, try to stringify for debugging
            if (typeof outputUrl === 'object') {
                console.error('model_file is not a string:', outputUrl);
                throw new Error('Model file is not a valid URL');
            }
        }

        if (!outputUrl || typeof outputUrl !== 'string') {
            console.error('Unexpected output format:', output);
            throw new Error('Failed to get model URL from output');
        }

        console.log('Model URL:', outputUrl);

        await incrementUsage(userId, {
            toolName: 'transform-to-3d',
            toolCategory: 'ai_tools',
            processingTimeMs: Date.now() - startTime,
            status: 'success',
        })

        return NextResponse.json({
            success: true,
            modelUrl: outputUrl
        })

    } catch (error) {
        console.error('3D Transform error:', error)
        try {
            if (userId) await incrementUsage(userId, { toolName: 'transform-to-3d', toolCategory: 'ai_tools', status: 'error', processingTimeMs: Date.now() - startTime })
        } catch (e) {
            console.error('Failed to log error usage:', e)
        }

        return NextResponse.json(
            { error: 'Processing failed: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
