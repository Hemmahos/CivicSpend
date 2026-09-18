const Parser = require('rss-parser');
const parser = new Parser();

async function run() {
    const country = 'Nigeria';
    const safeCountry = encodeURIComponent(country.toLowerCase());
    const queries = [
      `community+OR+NGO+OR+government+project+${safeCountry}+when:30d`,
      `infrastructure+OR+development+OR+initiative+${safeCountry}+when:30d`,
      `funding+OR+grant+OR+contract+awarded+${safeCountry}+when:30d`
    ];

    let allItems = [];
    
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

    console.log(`Found ${articles.length} articles`);
    if(articles.length > 0) {
        console.log(articles[0].title);
    }
}
run();
