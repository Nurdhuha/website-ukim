const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- PUBLIC-FACING READ OPERATIONS ---

// Generic function to get content by type for public consumption
const getContentByType = async (contentTypeSlug) => {
  let query;
  let params = [contentTypeSlug];

  switch (contentTypeSlug) {
    case 'gallery':
      query = `
        SELECT 
          c.id, c.title, c.body->>'imageUrl' as "imageUrl", 
          c.body->>'department' as department, 
          EXTRACT(YEAR FROM c.published_at) as year
        FROM content c
        JOIN content_types ct ON c.content_type_id = ct.id
        WHERE ct.slug = 'gallery' AND c.status = 'published'
        ORDER BY c.published_at DESC
      `;
      params = [];
      break;
    case 'achievement':
      query = `
        SELECT 
          c.id, c.title, c.summary as description, c.body->>'imageUrl' as "imageUrl", c.published_at as date
        FROM content c
        JOIN content_types ct ON c.content_type_id = ct.id
        WHERE ct.slug = 'achievement' AND c.status = 'published'
        ORDER BY c.published_at DESC
      `;
      params = [];
      break;
    case 'pengumuman':
      query = `
        SELECT 
          c.id, c.title, c.slug, c.summary, 
          ct.name as content_type_name,
          c.body->>'imageUrl' as "imageUrl",
          c.published_at as date,
          u.username as author_username
        FROM content c
        JOIN content_types ct ON c.content_type_id = ct.id
        LEFT JOIN users u ON c.author_id = u.id
        WHERE ct.slug = 'pengumuman' AND c.status = 'published'
        ORDER BY c.published_at DESC
      `;
      params = [];
      break;
    case 'akademik':
      query = `
        SELECT 
          c.id, c.title, c.slug, c.summary, 
          ct.name as content_type_name,
          c.body->>'contentFileUrl' as "contentFileUrl",
          c.published_at as date,
          u.username as author_username
        FROM content c
        JOIN content_types ct ON c.content_type_id = ct.id
        LEFT JOIN users u ON c.author_id = u.id
        WHERE ct.slug = 'akademik' AND c.status = 'published'
        ORDER BY c.published_at DESC
      `;
      params = [];
      break;
    case 'artikel':
      query = `
        SELECT 
          c.id, c.title, c.slug, c.summary, 
          ct.name as content_type_name,
          c.body->>'imageUrl' as "imageUrl",
          c.body->>'content' as "content",
          c.published_at as date,
          u.username as author_username
        FROM content c
        JOIN content_types ct ON c.content_type_id = ct.id
        LEFT JOIN users u ON c.author_id = u.id
        WHERE ct.slug = 'artikel' AND c.status = 'published'
        ORDER BY c.published_at DESC
      `;
      params = [];
      break;

    default:
      query = `
        SELECT 
          c.id, c.title, c.slug, c.summary, c.body, c.status, c.published_at,
          ct.name as content_type_name,
          u.username as author_username
        FROM content c
        JOIN content_types ct ON c.content_type_id = ct.id
        LEFT JOIN users u ON c.author_id = u.id
        WHERE ct.slug = $1 AND c.status = 'published'
        ORDER BY c.published_at DESC
      `;
      break;
  }

  const { rows } = await pool.query(query, params);
  return rows;
};

exports.getPublicContentByType = async (req, res) => {
    try {
      const { type } = req.params;
      const content = await getContentByType(type);
      res.json(content);
    } catch (err) {
      console.error(`Error fetching content for type ${req.params.type}:`, err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// --- ADMIN CRUD OPERATIONS ---

// GET all content for admin (includes drafts)
exports.getAllAdminContent = async (req, res) => {
  const { type, category } = req.query;
  if (!type) {
    return res.status(400).json({ message: 'Content type query parameter is required.' });
  }
  try {
    let queryText = `SELECT c.*, ct.name as content_type_name, c.body->>'category' as category FROM content c
       JOIN content_types ct ON c.content_type_id = ct.id
       WHERE ct.slug = $1`;
    const params = [type];

    queryText += ` ORDER BY c.updated_at DESC`;

    const result = await pool.query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin content:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST a new content item
exports.createContent = async (req, res) => {
  const { type, title, slug, summary, body, status, published_at } = req.body;

  if (!type || !title) {
    return res.status(400).json({ message: 'Type and title are required.' });
  }

  try {
    const finalBody = { ...body };

    const result = await pool.query(
      `INSERT INTO content (content_type_id, title, slug, summary, body, author_id, status, published_at)
       VALUES ((SELECT id FROM content_types WHERE slug = $1), $2, $3, $4, $5, (SELECT id FROM users WHERE username = 'admin'), $6, $7)
       RETURNING *`,
      [type, title, slug, summary, finalBody, status || 'draft', published_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT to update a content item
exports.updateContent = async (req, res) => {
  const { id } = req.params;
  const { title, slug, summary, body, status, published_at } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  try {
    const finalBody = { ...body };
    
    const result = await pool.query(
      `UPDATE content
       SET title = $1, slug = $2, summary = $3, body = $4, status = $5, published_at = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, slug, summary, finalBody, status, published_at, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating content ${id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE a content item
exports.deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM content WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    console.error(`Error deleting content ${id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};