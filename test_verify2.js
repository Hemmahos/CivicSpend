const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const mimeType = "image/png";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Return JSON {"is_match": true}` },
            { inlineData: { data: base64Data, mimeType: mimeType } }
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
    console.log("Success:", response.text);
  } catch(e) {
    console.error("Failed:", e.message);
  }
}
run();
