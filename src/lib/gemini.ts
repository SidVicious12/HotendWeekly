import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    console.warn('⚠️ GOOGLE_GENERATIVE_AI_API_KEY is missing from environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || 'missing-key');

export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Helper to convert File or Buffer to Gemini compatible part
export function fileToGenerativePart(buffer: Buffer, mimeType: string) {
    return {
        inlineData: {
            data: buffer.toString('base64'),
            mimeType,
        },
    };
}

export async function analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    prompt: string
): Promise<string> {
    try {
        const model = geminiFlash;
        const imagePart = fileToGenerativePart(imageBuffer, mimeType);

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini Analysis Error:', error);
        throw new Error('Failed to analyze image with Gemini');
    }
}
