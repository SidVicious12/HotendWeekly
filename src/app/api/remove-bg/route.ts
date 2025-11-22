import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Replicate from 'replicate'
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let userId: string | null = null

  try {
    // 1. Authenticate user
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    
    userId = user?.id || null

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Check usage limits
    const limitCheck = await checkUsageLimit(user.id, 'remove-background')

    if (!limitCheck.allowed) {
      await incrementUsage(user.id, {
        toolName: 'remove-background',
        toolCategory: 'ai_tools',
        status: 'rate_limited',
        processingTimeMs: Date.now() - startTime,
      })

      return NextResponse.json(
        {
          error: `Usage limit exceeded: ${limitCheck.reason}`,
          currentUsage: limitCheck.currentUsage,
          limit: limitCheck.limit,
          dailyRemaining: limitCheck.dailyRemaining,
          monthlyRemaining: limitCheck.monthlyRemaining,
          upgradeUrl: '/pricing',
        },
        { status: 429 }
      )
    }

    // 3. Parse and validate request
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const replicateApiKey = process.env.REPLICATE_API_TOKEN

    if (!replicateApiKey) {
      return NextResponse.json({
        success: false,
        simulated: true,
        message: 'Add REPLICATE_API_TOKEN to environment variables'
      }, { status: 400 })
    }

    console.log('🎨 Starting background removal with Replicate RMBG-2.0...')

    // Convert image to base64 data URL
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${imageFile.type};base64,${base64Image}`

    // Use Replicate RMBG-2.0 for background removal
    const replicate = new Replicate({ auth: replicateApiKey })

    const prediction = await replicate.predictions.create({
      version: "62662796de6e28b101e8d0e1e5ce6941d11c3e5c88f42bb71f5c0d62dedb16fa", // RMBG-2.0
      input: {
        image: dataUrl
      }
    })

    // Poll until background removal completes
    let completed = prediction
    let pollCount = 0
    const maxPolls = 30 // 30 seconds max

    while (completed.status !== 'succeeded' && completed.status !== 'failed' && pollCount < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      completed = await replicate.predictions.get(prediction.id)
      pollCount++

      if (pollCount % 5 === 0) {
        console.log(`⏳ Background removal progress: ${pollCount}s elapsed...`)
      }
    }

    if (completed.status === 'failed') {
      throw new Error('Background removal failed: ' + completed.error)
    }

    if (pollCount >= maxPolls) {
      throw new Error('Background removal timed out after 30 seconds')
    }

    // Get the result image URL
    const resultImageUrl = Array.isArray(completed.output)
      ? completed.output[0]
      : completed.output

    if (!resultImageUrl) {
      throw new Error('No output image received from Replicate')
    }

    console.log('✅ Background removed successfully!')

    // Fetch the image and convert to base64
    const imageResponse = await fetch(resultImageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const resultBase64 = Buffer.from(imageBuffer).toString('base64')

    // 4. Record successful usage
    await incrementUsage(user.id, {
      toolName: 'remove-background',
      toolCategory: 'ai_tools',
      processingTimeMs: Date.now() - startTime,
      status: 'success',
      requestMetadata: {
        inputImageSize: bytes.byteLength,
      },
      responseMetadata: {
        outputFormat: 'png',
        outputSize: imageBuffer.byteLength,
      },
    })

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${resultBase64}`,
      simulated: false
    })

  } catch (error) {
    console.error('❌ Background removal error:', error)

    // Record failed usage
    if (userId) {
      await incrementUsage(userId, {
        toolName: 'remove-background',
        toolCategory: 'ai_tools',
        processingTimeMs: Date.now() - startTime,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    return NextResponse.json(
      {
        error: 'Failed to remove background',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
