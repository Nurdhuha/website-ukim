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
        const result = await pool.query(
            `SELECT 
                id, 
                title, 
                status,
                summary as department,
                published_at as "activityDate",
                body->'imageUrls' as "imageUrls",
                updated_at
             FROM content 
             WHERE content_type_id = $1 
             ORDER BY updated_at DESC`, 
            [galleryTypeId]
        );
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
            `SELECT 
                id, 
                title, 
                summary as department,
                published_at as "activityDate",
                body->'imageUrls' as "imageUrls"
             FROM content 
             WHERE content_type_id = $1 AND status = 'published' 
             ORDER BY published_at DESC`,
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
    const { title, status, department, activityDate, body } = req.body;

    if (!title || !body || !body.imageUrls || body.imageUrls.length === 0) {
        return res.status(400).json({ message: 'Title and at least one image are required.' });
    }

    try {
        const galleryTypeId = await getGalleryTypeId();
        
        const result = await pool.query(
            `INSERT INTO content (content_type_id, title, summary, body, author_id, status, published_at)
             VALUES ($1, $2, $3, $4, (SELECT id FROM users WHERE username = 'admin'), $5, $6)
             RETURNING *`,
            [galleryTypeId, title, department, body, status || 'draft', activityDate]
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
    const { title, status, department, activityDate, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required.' });
    }

    try {
        const result = await pool.query(
            `UPDATE content
             SET title = $1, summary = $2, body = $3, status = $4, updated_at = CURRENT_TIMESTAMP, published_at = $5
             WHERE id = $6
             RETURNING *`,
            [title, department, body, status, activityDate, id]
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
