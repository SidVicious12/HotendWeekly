import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const garmentImage = formData.get('garment_image') as File
    const modelImage = formData.get('model_image') as File
    const category = formData.get('category') as string || 'upper_body'

    if (!garmentImage || !modelImage) {
      return NextResponse.json(
        { error: 'Both garment and model images are required' },
        { status: 400 }
      )
    }

    const apiToken = process.env.REPLICATE_API_TOKEN

    if (!apiToken || apiToken === 'your_replicate_api_key_here') {
      return NextResponse.json({
        success: false,
        simulated: true,
        message: 'Add your Replicate API token to .env.local for real virtual try-on processing.'
      })
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: apiToken,
    })

    // Convert images to data URLs
    const garmentBuffer = await garmentImage.arrayBuffer()
    const modelBuffer = await modelImage.arrayBuffer()

    const garmentBase64 = Buffer.from(garmentBuffer).toString('base64')
    const modelBase64 = Buffer.from(modelBuffer).toString('base64')

    const garmentDataUrl = `data:${garmentImage.type};base64,${garmentBase64}`
    const modelDataUrl = `data:${modelImage.type};base64,${modelBase64}`

    console.log('Starting virtual try-on prediction...')
    console.log('Garment image size:', garmentBuffer.byteLength, 'bytes')
    console.log('Model image size:', modelBuffer.byteLength, 'bytes')

    // Run IDM-VTON model
    const output = await replicate.run(
      "cuuupid/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
      {
        input: {
          garm_img: garmentDataUrl,
          human_img: modelDataUrl,
          garment_des: "product", // Add garment description
          category: category,
          crop: false, // Try without cropping first
          n_steps: 30,
          seed: 42
        }
      }
    )

    console.log('Virtual try-on completed:', output)

    // The output is a URL to the generated image
    const imageUrl = Array.isArray(output) ? output[0] : output

    return NextResponse.json({
      success: true,
      image: imageUrl,
      simulated: false
    })

  } catch (error) {
    console.error('Virtual try-on error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process virtual try-on',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
