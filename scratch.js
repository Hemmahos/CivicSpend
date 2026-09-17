const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({});

async function run() {
  const prompt = `
You are an expert data extractor. I have a list of news articles about government infrastructure projects in Nigeria.
Extract any distinct public infrastructure construction projects mentioned in these articles.

CRITICAL DEDUPLICATION INSTRUCTIONS:
1. DO NOT include any project that is semantically identical or refers to the same underlying project as these existing projects currently in our database:
[]
2. Ensure there are NO duplicates within your own output. If the same project is mentioned across multiple articles, combine the information into a single project object.

Return the data as a JSON array matching exactly this schema for each project:
{
  "id": "generate a unique string starting with ai_",
  "project_name": "Name of the project"
}

Do not include markdown blocks or any text outside the JSON array. Only return the raw JSON array.

Articles:
[
  {
    "title": "Lagos begins construction of N50bn 4th Mainland Bridge",
    "snippet": "Lagos state governor flag off 4th mainland bridge project.",
    "link": "http://example.com/1",
    "pubDate": "Wed, 17 Sep 2026"
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    console.log("Response:", response.text);
  } catch(e) {
    console.error("Gemini failed:", e.message);
  }
}
run();
