import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { name, profession, idNumber, image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Parse the base64 data URL
    // Format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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

Review the attached ID card image. Do the details match? Return JSON with a single boolean property "is_match" set to true if the ID card belongs to this user and confirms their stated profession, and false otherwise. Be lenient with minor typos or abbreviations, but strict about the core identity and profession matching.`
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
            }
          },
          required: ["is_match"]
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
