const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const newsController = require('../controllers/newsController');
const sourceController = require('../controllers/sourceController');
const { requireAuth, requireAdmin, requireCredential } = require('../middleware/auth');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authController.me);

// API Key Management
router.get('/user/key', requireAuth, authController.getApiKey);
router.post('/user/key/rotate', requireAuth, authController.rotateApiKey);

// News Routes
router.get('/config', requireCredential, newsController.getConfig);
router.get('/news/:source', requireCredential, newsController.getNews);
router.get('/news/:source/:category', requireCredential, newsController.getNews);

// Admin Source Management
router.get('/sources', requireAdmin, sourceController.getAllSources);
router.post('/sources', requireAdmin, sourceController.upsertSource);
router.delete('/sources/:id', requireAdmin, sourceController.deleteSource);

module.exports = router;
