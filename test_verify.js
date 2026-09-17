const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const mimeType = "image/png";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Test` },
            { inlineData: { data: base64Data, mimeType: mimeType } }
          ]
        }
      ]
    });
    console.log("Success:", response.text);
  } catch(e) {
    console.error("Failed:", e.message);
  }
}
run();
