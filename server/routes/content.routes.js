const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');

// --- Admin CRUD routes ---

// GET all content of a type for the admin panel (includes drafts)
// e.g., /api/content/admin/all?type=news
router.get('/admin/all', contentController.getAllAdminContent);

// --- Public-facing routes ---

// GET content by type (e.g., /api/content/news)
router.get('/:type', contentController.getPublicContentByType);

// POST a new content item
router.post('/', contentController.createContent);

// PUT to update a content item
router.put('/:id', contentController.updateContent);

// DELETE a content item
router.delete('/:id', contentController.deleteContent);


module.exports = router;
