const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// GET all events
router.get('/', eventController.getAllEvents);

// POST a new event
router.post('/', eventController.createEvent);

// PUT to update an event
router.put('/:id', eventController.updateEvent);

// DELETE an event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;