const db = require('../utils/db');

// Check if user is logged in
const requireAuth = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ success: false, message: 'Authentication required' });
};

// Check if user is platform admin
const requireAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') return next();
    res.status(403).json({ success: false, message: 'Access denied: Admin only' });
};

// Hybrid: Check API Key OR Admin Session
const requireCredential = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    // 1. Admin Session bypass
    if (req.session.userId && req.session.role === 'admin') return next();

    // 2. API Key Check
    if (apiKey) {
        const user = await db.getUserByApiKey(apiKey);
        if (user) {
            req.user = user;
            return next();
        }
    }

    res.status(401).json({ success: false, message: 'Valid API Key or Admin Login required' });
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireCredential
};
