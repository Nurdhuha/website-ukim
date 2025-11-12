require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const multer = require('multer');

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

// Configure multer for image uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure multer for PDF uploads
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

// --- Upload Endpoints ---
app.post('/api/upload', (req, res) => {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send({ message: 'File is too large. Max size is 2MB.' });
            }
            return res.status(400).send({ message: err.message });
        } else if (err) {
            return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
        
        res.status(200).send({
            message: 'File uploaded successfully.',
            filePath: `/uploads/${req.file.filename}`
        });
    });
});

app.post('/api/upload-pdf', (req, res) => {
    pdfUpload.single('pdf')(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a PDF file.' });
        }

        res.status(200).send({
            message: 'File uploaded successfully.',
            filePath: `/uploads/${req.file.filename}`
        });
    });
});


// Import routes
const contentRoutes = require('./routes/content.routes');
const eventRoutes = require('./routes/event.routes');
const galleryRoutes = require('./routes/gallery.routes');

// Basic API Route
app.get('/', (req, res) => {
  res.send('Backend is running and connected to PostgreSQL!');
});

// Use routes
app.use('/api/content', contentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});