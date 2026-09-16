import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';

const parser = new Parser();
// The GoogleGenAI SDK reads from process.env.GEMINI_API_KEY by default if not passed.
const ai = new GoogleGenAI({});

export async function GET() {
  try {
    // 1. Fetch RSS feed for Nigerian infrastructure projects
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=government+infrastructure+project+nigeria+construction&hl=en-US&gl=US&ceid=US:en');
    
    // Get top 5 articles
    const articles = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      snippet: item.contentSnippet || item.content,
      link: item.link,
      pubDate: item.pubDate
    }));

    if (articles.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, returning error.");
      return NextResponse.json({ error: "Gemini API key is missing. Please configure it in your Vercel Dashboard." }, { status: 400 });
    }

    // 2. Prepare prompt for Gemini
    const prompt = `
You are an expert data extractor. I have a list of news articles about government infrastructure projects in Nigeria.
Extract any distinct public infrastructure construction projects mentioned in these articles.
Return the data as a JSON array matching exactly this schema for each project:
{
  "id": "generate a unique string starting with ai_",
  "project_name": "Name of the project",
  "location": {
    "state_or_region": "State or Region name",
    "specific_address": "City or specific address",
    "lat": approximate latitude as a number,
    "lng": approximate longitude as a number
  },
  "financials": {
    "total_budget_claimed_local_currency": estimated budget as a number (if missing, use 0),
    "expert_verified_value": null
  },
  "deliverables": ["List", "of", "deliverables", "inferred"],
  "status": "pending",
  "sources": ["URL of the article"],
  "origin": "ai_scan",
  "upvotes": 0,
  "downvotes": 0,
  "mediaUrl": "https://images.unsplash.com/photo-1541888087405-d91d915ba8eb?q=80&w=1600&auto=format&fit=crop" // use a generic construction image placeholder
}

Do not include markdown blocks or any text outside the JSON array. Only return the raw JSON array.

Articles:
${JSON.stringify(articles, null, 2)}
`;

    // 3. Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    let projects = [];
    if (text) {
      try {
        projects = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse Gemini response:", text);
      }
    }

    return NextResponse.json({ projects });

  } catch (error) {
    console.error("AI Scan Error:", error);
    return NextResponse.json({ error: "Failed to perform AI scan" }, { status: 500 });
  }
}
