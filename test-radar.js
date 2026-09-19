require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const Parser = require('rss-parser');
const parser = new Parser();

(async () => {
  try {
    const safeCountry = encodeURIComponent('Nigeria');
    const queries = [
      `Nigeria public infrastructure budget when:30d`,
      `road construction contract awarded ${safeCountry} when:30d`
    ];

    const feedPromises = queries.map(q => 
      parser.parseURL(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`).catch((e) => {
        console.error("RSS Error:", e.message);
        return { items: [] };
      })
    );
    const feeds = await Promise.all(feedPromises);
    let allItems = [];
    for (const feed of feeds) {
      allItems = [...allItems, ...feed.items];
    }
    console.log("Articles found:", allItems.length);
    
    if (allItems.length === 0) {
      console.log("No articles");
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Test prompt`;
    console.log("Calling Gemini...");
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash-latest',
      contents: prompt
    });
    console.log("Gemini responded:", response.text);
  } catch (error) {
    console.error("Fatal Error:", error);
  }
})();
