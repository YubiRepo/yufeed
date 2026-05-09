const db = require('../utils/db');
const crypto = require('crypto');

exports.getKeys = async (req, res) => {
    try {
        const keys = await db.getApiKeyStats(req.session.userId);
        res.json({ success: true, keys });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

exports.createKey = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Key name is required' });

    try {
        const key = 'yf_' + crypto.randomBytes(24).toString('hex');
        await db.createApiKey(req.session.userId, name, key);
        res.json({ success: true, message: 'New access key generated' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

exports.deleteKey = async (req, res) => {
    const { id } = req.params;
    try {
        await db.deleteApiKey(req.session.userId, id);
        res.json({ success: true, message: 'Access key revoked' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

exports.getKeyLogs = async (req, res) => {
    const { id } = req.params;
    try {
        const logs = await db.getApiKeyLogs(req.session.userId, id);
        res.json({ success: true, logs });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
