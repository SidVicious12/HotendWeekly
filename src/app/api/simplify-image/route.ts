import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      return NextResponse.json({
        success: false,
        simulated: true,
        message: 'Add OPENAI_API_KEY to environment variables'
      }, { status: 400 })
    }

    console.log('🎨 Starting image simplification with GPT-4 Vision + DALL-E 3...')

    // Convert image to base64 data URL
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${imageFile.type};base64,${base64Image}`

    const openai = new OpenAI({ apiKey: openaiApiKey })

    // Step 1: Use GPT-4 Vision to analyze the image with ENHANCED prompting
    console.log('👁️ Step 1/2: Analyzing image with GPT-4 Vision (enhanced prompting)...')
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image for recreating it as a simplified vector-style illustration for 3D printing. Provide a detailed description following this structure:

1. COMPOSITION & LAYOUT:
   - Exact positioning of the main subject (center, left, right, top, bottom)
   - Viewing angle and perspective
   - Background elements and their positions

2. MAIN SUBJECT DETAILS:
   - Shape and form description
   - Distinctive features and characteristics
   - Pose or orientation

3. COLOR PALETTE (limit to 4-5 colors):
   - List the dominant colors in order of prominence
   - Note where each color appears on the subject

4. SPATIAL RELATIONSHIPS:
   - How elements relate to each other
   - Overlapping or separation between components

5. STYLE NOTES:
   - Any patterns, textures, or details that define the subject

Be extremely precise about positioning, colors, and composition to ensure accurate recreation. This description will be used to generate a simplified vector illustration that maintains the exact same layout and subject.`
            },
            {
              type: "image_url",
              image_url: { url: dataUrl }
            }
          ]
        }
      ],
      max_tokens: 500
    })

    const imageDescription = visionResponse.choices[0].message.content || 'A simple illustration'
    console.log('📝 Image description:', imageDescription)

    // Step 2: Use DALL-E 3 to generate simplified vector-style version with enhanced instructions
    console.log('🎨 Step 2/2: Generating simplified version with DALL-E 3...')
    const dalleResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a simplified vector-style illustration for 3D printing based on this EXACT description:

${imageDescription}

CRITICAL REQUIREMENTS:
- Recreate the EXACT composition and layout described above
- Maintain the SAME positioning, viewing angle, and spatial relationships
- Use ONLY the colors specified (4-5 flat colors maximum)
- NO gradients, NO shadows, NO complex shading
- Clean vector style with bold, defined outlines
- White or light neutral background
- Simplified geometric shapes while preserving the subject's recognizable features
- Keep all elements in their described positions

Style: Simple vector illustration, flat colors, bold outlines, suitable for multi-color 3D printing.`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    })

    const generatedImageUrl = dalleResponse.data?.[0]?.url

    if (!generatedImageUrl) {
      throw new Error('No output image received from DALL-E 3')
    }

    console.log('✅ Image simplified successfully!')

    // Fetch the image and convert to base64
    const imageResponse = await fetch(generatedImageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const resultBase64 = Buffer.from(imageBuffer).toString('base64')

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${resultBase64}`,
      description: imageDescription,
      simulated: false
    })

  } catch (error) {
    console.error('❌ Image simplification error:', error)
    return NextResponse.json(
      {
        error: 'Failed to simplify image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
