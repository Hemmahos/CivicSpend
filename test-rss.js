const Parser = require('rss-parser');
const parser = new Parser();

async function run() {
    const q = 'community+OR+NGO+OR+government+project+nigeria+when:30d';
    const feedUS = await parser.parseURL(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`).catch(() => ({ items: [] }));
    const feedNG = await parser.parseURL(`https://news.google.com/rss/search?q=${q}&hl=en-NG&gl=NG&ceid=NG:en`).catch(() => ({ items: [] }));
    
    console.log(`US feed: ${feedUS.items.length}`);
    if (feedUS.items.length > 0) console.log(feedUS.items[0].title);
    
    console.log(`NG feed: ${feedNG.items.length}`);
    if (feedNG.items.length > 0) console.log(feedNG.items[0].title);
}
run();
