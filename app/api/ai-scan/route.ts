import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;

const parser = new Parser();
// The GoogleGenAI SDK reads from process.env.GEMINI_API_KEY by default if not passed.
const ai = new GoogleGenAI({});

export async function POST(request: Request) {
  try {
    let existingProjects: string[] = [];
    let country = 'Nigeria';
    try {
      const body = await request.json();
      if (body.existingProjects && Array.isArray(body.existingProjects)) {
        existingProjects = body.existingProjects;
      }
      if (body.country && typeof body.country === 'string') {
        country = body.country;
      }
    } catch (e) {
      // Ignore body parsing errors
    }

    // 1. Fetch RSS feeds for multiple comprehensive queries to cast a wider net
    const safeCountry = encodeURIComponent(country.toLowerCase());
    const queries = [
      `community+OR+NGO+OR+government+project+${safeCountry}+when:30d`,
      `infrastructure+OR+development+OR+initiative+${safeCountry}+when:30d`,
      `funding+OR+grant+OR+contract+awarded+${safeCountry}+when:30d`
    ];

    let allItems: any[] = [];
    
    // Fetch all feeds in parallel for speed
    const feedPromises = queries.map(q => 
      parser.parseURL(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`).catch(() => ({ items: [] }))
    );
    const feeds = await Promise.all(feedPromises);
    
    for (const feed of feeds) {
      allItems = [...allItems, ...feed.items];
    }

    // Deduplicate articles by link to avoid redundant context
    const uniqueArticlesMap = new Map();
    for (const item of allItems) {
      if (!uniqueArticlesMap.has(item.link)) {
        uniqueArticlesMap.set(item.link, item);
      }
    }
    const uniqueArticles = Array.from(uniqueArticlesMap.values());
    
    // Feed the top 25 articles to Gemini to maximize project discovery
    const articles = uniqueArticles.slice(0, 25).map(item => ({
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
You are an expert data extractor. I have a list of news articles about government, NGO, and community development projects in ${country}.
Extract any distinct projects mentioned in these articles (such as infrastructure, health, education, tech, or social initiatives).

CRITICAL DEDUPLICATION INSTRUCTIONS:
1. DO NOT include any project that is semantically identical or refers to the same underlying project as these existing projects currently in our database:
[${existingProjects.join(', ')}]
2. Ensure there are NO duplicates within your own output. If the same project is mentioned across multiple articles, combine the information into a single project object.

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
  "mediaUrl": "https://images.unsplash.com/photo-1541888087405-d91d915ba8eb?q=80&w=1600&auto=format&fit=crop"
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
