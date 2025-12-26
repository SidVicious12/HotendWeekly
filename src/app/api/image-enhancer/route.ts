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

        const limitCheck = await checkUsageLimit(user.id, 'image-enhancer')
        if (!limitCheck.allowed) {
            await incrementUsage(user.id, {
                toolName: 'image-enhancer',
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
        const replicate = new Replicate({ auth: replicateApiKey })

        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString('base64')
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`

        const prediction = await replicate.predictions.create({
            version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b", // Real-ESRGAN
            input: {
                image: dataUrl,
                scale: 2,
                face_enhance: true
            }
        })

        let completed = prediction
        let pollCount = 0
        while (completed.status !== 'succeeded' && completed.status !== 'failed' && pollCount < 40) {
            await new Promise(r => setTimeout(r, 1000))
            completed = await replicate.predictions.get(prediction.id)
            pollCount++
        }

        if (completed.status !== 'succeeded') throw new Error('Enhancement failed')

        const outputUrl = completed.output
        const res = await fetch(outputUrl)
        const blob = await res.arrayBuffer()
        const base64Result = Buffer.from(blob).toString('base64')

        await incrementUsage(user.id, {
            toolName: 'image-enhancer',
            toolCategory: 'ai_tools',
            processingTimeMs: Date.now() - startTime,
            status: 'success',
        })

        return NextResponse.json({
            success: true,
            image: `data:image/png;base64,${base64Result}`
        })

    } catch (error) {
        console.error('Enhancer error:', error)
        if (userId) await incrementUsage(userId, { toolName: 'image-enhancer', toolCategory: 'ai_tools', status: 'error', processingTimeMs: Date.now() - startTime })
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
}
