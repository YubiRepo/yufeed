const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const feedid = require('./src/index');
const db = require('./src/utils/db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard')));

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FeedID News Crawler API',
            version: '2.0.0',
            description: 'API for crawling news from various Indonesian & International sources dynamically.',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./server.js'], // Documentation is in this file
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @openapi
 * /api/config:
 *   get:
 *     summary: Get all source configurations
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/api/config', (req, res) => {
    res.json(feedid.getConfig());
});

/**
 * @openapi
 * /api/news/{source}/{category}:
 *   get:
 *     summary: Fetch news from a source and category
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: fetchDetail
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Success
 */
const newsHandler = async (req, res) => {
    const { source, category } = req.params;
    const { fetchDetail } = req.query;

    try {
        const crawler = feedid.get(source);
        if (!crawler) {
            return res.status(404).json({ success: false, message: 'Source not found' });
        }

        const categories = Object.keys(crawler);
        const targetCategory = category || (crawler.terbaru ? 'terbaru' : categories[0]);
        const fetchMethod = crawler[targetCategory];
        
        if (!fetchMethod) {
            return res.status(404).json({ success: false, message: `Category ${targetCategory} not found` });
        }

        const result = await fetchMethod({ fetchDetail: fetchDetail === 'true' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

app.get('/api/news/:source', newsHandler);
app.get('/api/news/:source/:category', newsHandler);

/**
 * @openapi
 * /api/sources:
 *   get:
 *     summary: List all news sources in database
 *   post:
 *     summary: Add or update a news source
 */
app.get('/api/sources', async (req, res) => {
    const sources = await db.getAllSources();
    res.json(sources);
});

app.post('/api/sources', async (req, res) => {
    const { id, name, baseUrl, categories, selectors } = req.body;
    try {
        await db.upsertSource(id, name, baseUrl, categories, selectors);
        await feedid.init(); // Hot-reload crawlers
        res.json({ success: true, message: 'Source saved and crawlers reloaded' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/sources/:id', async (req, res) => {
    try {
        await db.deleteSource(req.params.id);
        await feedid.init();
        res.json({ success: true, message: 'Source deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Initialize and start
async function start() {
    await db.initDb();
    await feedid.init();
    app.listen(PORT, () => {
        console.log(`
🚀 FeedID Dashboard Server is running!
---------------------------------------
Dashboard: http://localhost:${PORT}
API Docs:  http://localhost:${PORT}/api-docs
---------------------------------------
        `);
    });
}

start();
