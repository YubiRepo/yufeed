const feedid = require('../index');
const NodeCache = require('node-cache');
const newsCache = new NodeCache({ stdTTL: 300 });

exports.getConfig = (req, res) => {
    res.json(feedid.getConfig());
};

exports.getNews = async (req, res) => {
    const { source, category } = req.params;
    const { fetchDetail } = req.query;
    const cacheKey = `${source}-${category}-${fetchDetail}`;

    const cachedData = newsCache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    try {
        const crawler = feedid.get(source);
        if (!crawler) return res.status(404).json({ success: false, message: 'Source not found' });

        const categories = Object.keys(crawler);
        const targetCategory = category || (crawler.terbaru ? 'terbaru' : categories[0]);
        const fetchMethod = crawler[targetCategory];
        
        if (!fetchMethod) return res.status(404).json({ success: false, message: `Category ${targetCategory} not found` });

        const result = await fetchMethod({ fetchDetail: fetchDetail === 'true' });
        newsCache.set(cacheKey, result);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
