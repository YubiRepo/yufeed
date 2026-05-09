const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const feedid = require('./src/index');
const db = require('./src/utils/db');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Session Configuration
const FileStore = require('session-file-store')(session);
app.use(session({
    store: new FileStore({ path: './sessions' }),
    secret: 'yufeed-ultra-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Yufeed Intelligence API',
            version: '2.5.0',
            description: 'Advanced news crawler and aggregator system.',
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' }
            }
        },
        security: [{ ApiKeyAuth: [] }],
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./src/routes/api.js'], // Pointing to the new route file
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api', apiRoutes);

// SPA Fallback
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Bootstrap Server
async function bootstrap() {
    try {
        await db.initDb();
        await feedid.init();
        app.listen(PORT, () => {
            console.log(`
🚀 Yufeed Architecture Optimized!
---------------------------------------
Environment: Production
Port:        ${PORT}
Dashboard:   http://localhost:${PORT}
API Docs:    http://localhost:${PORT}/api-docs
---------------------------------------
            `);
        });
    } catch (error) {
        console.error('❌ Failed to bootstrap server:', error);
        process.exit(1);
    }
}

bootstrap();
