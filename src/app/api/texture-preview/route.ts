import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Replicate from 'replicate'
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker'

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    let userId: string | null = null

    try {
        const cookieStore = await cookies()
        const supabase = createServerComponentClient({ cookies: () => cookieStore })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        userId = user?.id || null
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const limitCheck = await checkUsageLimit(user.id, 'texture-preview')
        if (!limitCheck.allowed) {
            return NextResponse.json({ error: 'Usage limit exceeded' }, { status: 429 })
        }

        const formData = await request.formData()
        const imageFile = formData.get('image') as File
        const texture = formData.get('texture') as string || 'wood'
        const prompt = `change the material of the object to ${texture} texture, realistic, high detail`

        const replicateApiKey = process.env.REPLICATE_API_TOKEN
        const replicate = new Replicate({ auth: replicateApiKey })

        const bytes = await imageFile.arrayBuffer()
        const base64Image = Buffer.from(bytes).toString('base64')
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`

        const prediction = await replicate.predictions.create({
            version: "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
            input: {
                image: dataUrl,
                prompt: prompt,
                image_guidance_scale: 1.4,
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

        await incrementUsage(user.id, {
            toolName: 'texture-preview',
            toolCategory: 'ai_tools',
            processingTimeMs: Date.now() - startTime,
            status: 'success',
        })

        return NextResponse.json({
            success: true,
            image: `data:image/png;base64,${base64Result}`
        })

    } catch (error) {
        if (userId) await incrementUsage(userId, { toolName: 'texture-preview', toolCategory: 'ai_tools', status: 'error', processingTimeMs: Date.now() - startTime })
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
}
