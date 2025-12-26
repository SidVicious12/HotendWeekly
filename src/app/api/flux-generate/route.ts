import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import OpenAI from 'openai'
import Replicate from 'replicate'
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker'

// Product category definitions for intelligent routing
interface ProductAnalysis {
  category: string
  displayType: 'handheld' | 'worn' | 'beside' | 'lifestyle'
  scenePrompt: string
  productDescription: string
}

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
    const limitCheck = await checkUsageLimit(user.id, 'flux-generate')

    if (!limitCheck.allowed) {
      await incrementUsage(user.id, {
        toolName: 'flux-generate',
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
    const productImage = formData.get('product_image') as File

    if (!productImage) {
      return NextResponse.json(
        { error: 'Product image is required' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    const replicateApiKey = process.env.REPLICATE_API_TOKEN

    if (!openaiApiKey || !replicateApiKey) {
      return NextResponse.json({
        success: false,
        simulated: true,
        message: 'Add OPENAI_API_KEY and REPLICATE_API_TOKEN to .env.local'
      })
    }

    console.log('🚀 Starting intelligent product photography workflow...')

    // STEP 1: Analyze product with GPT-4o Vision
    console.log('📸 Step 1/3: Analyzing product with AI vision...')
    const productBuffer = await productImage.arrayBuffer()
    const productBase64 = Buffer.from(productBuffer).toString('base64')
    const productDataUrl = `data:${productImage.type};base64,${productBase64}`

    const openai = new OpenAI({ apiKey: openaiApiKey })

    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this 3D printed product image and respond ONLY with valid JSON in this exact format:
{
  "category": "weapon|sports_equipment|wearable|vehicle|tool|decorative|functional|miniature",
  "displayType": "handheld|worn|beside|lifestyle",
  "productDescription": "brief description of the object",
  "scenePrompt": "detailed prompt for generating a photorealistic scene with a model holding/wearing/displaying this item"
}

Examples:
- Gun → {"category":"weapon","displayType":"handheld","productDescription":"metallic 3D printed firearm prop","scenePrompt":"professional male model in white t-shirt holding a metallic gun prop at chin level, studio lighting, clean background"}
- Basketball → {"category":"sports_equipment","displayType":"handheld","productDescription":"orange basketball","scenePrompt":"athletic person in sportswear holding a basketball, gym background, dynamic pose"}
- Jewelry → {"category":"wearable","displayType":"worn","productDescription":"silver ring","scenePrompt":"close-up of elegant hand wearing a silver ring, soft lighting, luxury aesthetic"}`
            },
            {
              type: "image_url",
              image_url: { url: productDataUrl }
            }
          ]
        }
      ],
      max_tokens: 300
    })

    let analysisText = visionResponse.choices[0].message.content || '{}'
    console.log('🧠 AI Analysis (raw):', analysisText)

    // Strip markdown code blocks if present
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    console.log('🧠 AI Analysis (cleaned):', analysisText)

    const analysis: ProductAnalysis = JSON.parse(analysisText)

    // STEP 2: Generate AI scene with FLUX.1 Pro
    console.log('🎨 Step 2/3: Generating AI scene with FLUX.1 Pro...')
    console.log('📝 Scene prompt:', analysis.scenePrompt)

    const replicate = new Replicate({ auth: replicateApiKey })

    const scenePrediction = await replicate.predictions.create({
      version: "80a09d66baa990429c2f5ae8a4306bf778a1b3775afd01cc2cc8bdbe9033769c", // FLUX.1 Pro
      input: {
        prompt: analysis.scenePrompt,
        aspect_ratio: "1:1",
        output_format: "png",
        output_quality: 90,
        safety_tolerance: 2,
        prompt_upsampling: true
      }
    })

    // Poll until scene generation completes
    let sceneCompleted = scenePrediction
    let pollCount = 0
    const maxPolls = 60 // 60 seconds max

    while (sceneCompleted.status !== 'succeeded' && sceneCompleted.status !== 'failed' && pollCount < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      sceneCompleted = await replicate.predictions.get(scenePrediction.id)
      pollCount++

      if (pollCount % 5 === 0) {
        console.log(`⏳ Scene generation progress: ${pollCount}s elapsed...`)
      }
    }

    if (sceneCompleted.status === 'failed') {
      throw new Error('Scene generation failed: ' + sceneCompleted.error)
    }

    if (pollCount >= maxPolls) {
      throw new Error('Scene generation timed out after 60 seconds')
    }

    const sceneImageUrl = Array.isArray(sceneCompleted.output)
      ? sceneCompleted.output[0]
      : sceneCompleted.output

    console.log('✅ Scene generated successfully!')

    // STEP 3: Composite product into scene (future enhancement)
    console.log('🎯 Step 3/3: Final compositing...')
    // For now, return the generated scene
    // Future: Use inpainting to insert actual product

    // 4. Record successful usage
    await incrementUsage(user.id, {
      toolName: 'flux-generate',
      toolCategory: 'ai_tools',
      processingTimeMs: Date.now() - startTime,
      status: 'success',
      requestMetadata: {
        productImageSize: productBuffer.byteLength,
        category: analysis.category,
        displayType: analysis.displayType,
      },
      responseMetadata: {
        outputUrl: sceneImageUrl,
      },
    })

    return NextResponse.json({
      success: true,
      image: sceneImageUrl,
      analysis: {
        category: analysis.category,
        displayType: analysis.displayType,
        description: analysis.productDescription
      },
      steps: {
        step1: 'Product analyzed',
        step2: 'Scene generated',
        step3: 'Ready for compositing'
      }
    })

  } catch (error) {
    console.error('❌ Workflow error:', error)

    // Record failed usage
    if (userId) {
      await incrementUsage(userId, {
        toolName: 'flux-generate',
        toolCategory: 'ai_tools',
        processingTimeMs: Date.now() - startTime,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to generate product photography',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
