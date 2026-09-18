import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;

const parser = new Parser();

export async function POST(request: Request) {
  try {
    const safeCountry = encodeURIComponent('Nigeria');
    const queries = [
      `Nigeria public infrastructure budget when:30d`,
      `road construction contract awarded ${safeCountry} when:30d`,
      `new government project funding ${safeCountry} when:30d`
    ];

    let allItems: any[] = [];
    const feedPromises = queries.map(q => 
      parser.parseURL(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`).catch(() => ({ items: [] }))
    );
    const feeds = await Promise.all(feedPromises);
    
    for (const feed of feeds) {
      allItems = [...allItems, ...feed.items];
    }

    const uniqueArticlesMap = new Map();
    for (const item of allItems) {
      if (!uniqueArticlesMap.has(item.link)) {
        uniqueArticlesMap.set(item.link, item);
      }
    }
    const uniqueArticles = Array.from(uniqueArticlesMap.values());
    
    const articles = uniqueArticles.slice(0, 15).map(item => ({
      title: item.title,
      snippet: item.contentSnippet || item.content,
      link: item.link
    }));

    if (articles.length === 0) {
      return NextResponse.json([]);
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an expert civic technology data extractor. Analyze the following news excerpts. Identify any newly announced public infrastructure projects (e.g., roads, hospitals, schools). You must return a JSON array of objects. If no projects are found, return an empty array [].
Do not include markdown formatting like \`\`\`json.

Use this EXACT JSON schema for each object in the array:
{
  "project_name": "Name of the project",
  "location": "State or City mentioned",
  "claimed_budget_local": "Extract the numerical budget. If none, return 0",
  "currency": "e.g., NGN or USD",
  "source_url": "The URL of the article provided in the text"
}

Articles:
${JSON.stringify(articles, null, 2)}
`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-1.5-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
    } catch (apiError: any) {
      if (apiError.message && (apiError.message.includes('not found') || apiError.message.includes('not supported'))) {
        response = await ai.models.generateContent({
          model: 'gemini-pro',
          contents: prompt
        });
      } else {
        throw apiError;
      }
    }

    let text = response.text || '';
    
    text = text.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let projects = [];
    if (text) {
      try {
        let parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          projects = parsed;
        } else if (parsed && Array.isArray(parsed.projects)) {
          projects = parsed.projects;
        }
      } catch (e) {
        console.error("Failed to parse Gemini response:", text);
      }
    }

    return NextResponse.json(projects);

  } catch (error: any) {
    console.error("AI Radar Error:", error);
    return NextResponse.json({ 
      error: "Failed to perform AI radar scan",
      details: error.message || error.toString() 
    }, { status: 500 });
  }
}
