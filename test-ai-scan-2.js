const { GoogleGenAI } = require('@google/genai');
const Parser = require('rss-parser');
const parser = new Parser();

// This might fail if we don't have GEMINI_API_KEY locally
async function run() {
    const country = 'Nigeria';
    const safeCountry = encodeURIComponent(country.toLowerCase());
    const queries = [
      `community+OR+NGO+OR+government+project+${safeCountry}+when:30d`,
    ];

    let allItems = [];
    const feedPromises = queries.map(q => 
      parser.parseURL(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`).catch(() => ({ items: [] }))
    );
    const feeds = await Promise.all(feedPromises);
    
    for (const feed of feeds) {
      allItems = [...allItems, ...feed.items];
    }
    console.log(`Found ${allItems.length} raw articles.`);
}
run();
