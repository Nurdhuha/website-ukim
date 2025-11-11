require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL database at:', result.rows[0].now);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const contentRoutes = require('./routes/content.routes');
const eventRoutes = require('./routes/event.routes');

// Basic API Route
app.get('/', (req, res) => {
  res.send('Backend is running and connected to PostgreSQL!');
});

// Use content routes
app.use('/api/content', contentRoutes);
app.use('/api/events', eventRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
