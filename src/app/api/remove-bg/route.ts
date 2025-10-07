import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_REMOVEBG_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      // Return simulated result if no API key is set
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Using simulated background removal. Add your Remove.bg API key to .env.local for real processing.'
      })
    }

    // Convert File to Buffer
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Call Remove.bg API
    const removeBgFormData = new FormData()
    const blob = new Blob([buffer], { type: imageFile.type })
    removeBgFormData.append('image_file', blob)
    removeBgFormData.append('size', 'auto')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Remove.bg API error:', error)
      return NextResponse.json(
        { error: 'Failed to remove background', details: error },
        { status: response.status }
      )
    }

    // Get the processed image
    const resultBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(resultBuffer).toString('base64')

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      simulated: false
    })

  } catch (error) {
    console.error('Background removal error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
