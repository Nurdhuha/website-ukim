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

const path = require('path');
const multer = require('multer');

// --- File Upload Setup ---
// Make the 'uploads' directory publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- Upload Endpoint ---
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a file.' });
  }
  // The file is uploaded, return the path to be stored in the database
  // The path should be relative to the server's root URL
  res.status(200).send({
    message: 'File uploaded successfully.',
    // The path includes the '/uploads/' prefix which we made static
    filePath: `/uploads/${req.file.filename}`
  });
});

const pdfUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

app.post('/api/upload-pdf', pdfUpload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a PDF file.' });
  }
  res.status(200).send({
    message: 'File uploaded successfully.',
    filePath: `/uploads/${req.file.filename}`
  });
});

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
