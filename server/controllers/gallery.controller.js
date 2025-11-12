const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const getGalleryTypeId = async () => {
    const result = await pool.query("SELECT id FROM content_types WHERE slug = 'gallery'");
    if (result.rows.length === 0) {
        throw new Error("Content type 'gallery' not found.");
    }
    return result.rows[0].id;
}

// GET all gallery items for admin
exports.getAllGalleryItems = async (req, res) => {
    try {
        const galleryTypeId = await getGalleryTypeId();
        const result = await pool.query('SELECT * FROM content WHERE content_type_id = $1 ORDER BY updated_at DESC', [galleryTypeId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching admin gallery items:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET all public gallery items
exports.getPublicGalleryItems = async (req, res) => {
    try {
        const galleryTypeId = await getGalleryTypeId();
        const result = await pool.query(
            `SELECT id, title, body->>'imageUrl' as "imageUrl" FROM content WHERE content_type_id = $1 AND status = 'published' ORDER BY published_at DESC`,
            [galleryTypeId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching public gallery items:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST a new gallery item
exports.createGalleryItem = async (req, res) => {
    const { title, body, status } = req.body;

    if (!title || !body || !body.imageUrl) {
        return res.status(400).json({ message: 'Title and imageUrl are required.' });
    }

    try {
        const galleryTypeId = await getGalleryTypeId();
        const result = await pool.query(
            `INSERT INTO content (content_type_id, title, body, author_id, status)
             VALUES ($1, $2, $3, (SELECT id FROM users WHERE username = 'admin'), $4)
             RETURNING *`,
            [galleryTypeId, title, body, status || 'draft']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating gallery item:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// PUT to update a gallery item
exports.updateGalleryItem = async (req, res) => {
    const { id } = req.params;
    const { title, body, status } = req.body;

    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required.' });
    }

    try {
        const result = await pool.query(
            `UPDATE content
             SET title = $1, body = $2, status = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING *`,
            [title, body, status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Error updating gallery item ${id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// DELETE a gallery item
exports.deleteGalleryItem = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM content WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        res.status(204).send(); // No Content
    } catch (err) {
        console.error(`Error deleting gallery item ${id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
