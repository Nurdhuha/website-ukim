const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         id, title, description, location, is_all_day, created_by,
         start_date, end_date, start_time, end_time
       FROM calendar_events
       ORDER BY start_date ASC, start_time ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, start_date, end_date, start_time, end_time, location, is_all_day } = req.body;
  // Basic validation
  if (!title || !start_date) {
    return res.status(400).json({ message: 'Title and start_date are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO calendar_events (title, description, location, is_all_day, created_by, start_date, end_date, start_time, end_time)
       VALUES ($1, $2, $3, $4, (SELECT id FROM users WHERE username = 'admin'), $5, $6, $7, $8)
       RETURNING *`,
      [title, description, location, is_all_day, start_date, end_date, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, start_time, end_time, location, is_all_day } = req.body;

  if (!title || !start_date) {
    return res.status(400).json({ message: 'Title and start_date are required.' });
  }

  try {
    const result = await pool.query(
      `UPDATE calendar_events
       SET title = $1, description = $2, location = $3, is_all_day = $4, start_date = $5, end_date = $6, start_time = $7, end_time = $8
       WHERE id = $9
       RETURNING *`,
      [title, description, location, is_all_day, start_date, end_date, start_time, end_time, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating event ${id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM calendar_events WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    console.error(`Error deleting event ${id}:`, err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};