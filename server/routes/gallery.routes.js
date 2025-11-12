// server/routes/gallery.routes.js
const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');

// --- Admin CRUD routes ---
// GET semua item galeri untuk tabel admin
router.get('/admin/all', galleryController.getAllGalleryItems);

// --- Public-facing routes ---
// GET semua item galeri untuk halaman publik
router.get('/public', galleryController.getPublicGalleryItems);

// POST item galeri baru
router.post('/', galleryController.createGalleryItem);

// PUT untuk update item galeri
router.put('/:id', galleryController.updateGalleryItem);

// DELETE item galeri
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;