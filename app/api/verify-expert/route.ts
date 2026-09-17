import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { name, profession, idNumber, image } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, returning error.");
      return NextResponse.json({ error: "Gemini API key is missing. Please configure it in your .env.local file." }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Parse the base64 data URL
    // Format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert ID verifier for the CivicSpend decentralized infrastructure tracker.
The user claims:
- Name: ${name}
- Profession: ${profession}
- ID Number: ${idNumber}

Review the attached ID card image. Do the details match? 
Return JSON with two properties:
1. "is_match" (boolean): True if the ID card belongs to this user. If it's a standard government ID (passport, driver's license), it only needs to match the Name (and ideally ID number). Only reject based on profession if the document is clearly a professional license that mismatches. Be lenient with minor typos.
2. "reason" (string): A short, 1-sentence explanation of why it was approved or rejected (e.g. "Name and ID match standard passport, profession not required on passport." or "Name does not match the uploaded ID.").`
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_match: {
              type: Type.BOOLEAN
            },
            reason: {
              type: Type.STRING
            }
          },
          required: ["is_match", "reason"]
        }
      }
    });

    if (response.text) {
      try {
        const data = JSON.parse(response.text);
        return NextResponse.json(data);
      } catch (e) {
         console.warn("Failed to parse GenAI JSON response strictly", e);
         // Fallback manual parse just in case
         const isMatch = response.text.includes('"is_match": true') || response.text.includes('"is_match":true');
         return NextResponse.json({ is_match: isMatch });
      }
    }

    return NextResponse.json({ is_match: false });
  } catch (error) {
    console.error('Error verifying expert:', error);
    return NextResponse.json({ error: 'Failed to verify expert credentials' }, { status: 500 });
  }
}
