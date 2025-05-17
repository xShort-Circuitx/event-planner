const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create new event
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, date, category, reminder } = req.body;
    
    const event = new Event({
      name,
      description,
      date,
      category,
      reminder,
      user: req.user._id
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// Get all events for a user
router.get('/', auth, async (req, res) => {
  try {
    const { category, sortBy = 'date' } = req.query;
    let query = { user: req.user._id };

    if (category) {
      query.category = category;
    }

    const events = await Event.find(query).sort({ [sortBy]: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Get upcoming events
router.get('/upcoming', auth, async (req, res) => {
  try {
    const events = await Event.find({
      user: req.user._id,
      date: { $gte: new Date() }
    }).sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
  }
});

// Get event by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
});

// Update event
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'date', 'category', 'reminder'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    updates.forEach(update => event[update] = req.body[update]);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

module.exports = router; 