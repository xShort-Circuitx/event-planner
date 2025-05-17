const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Meetings', 'Birthdays', 'Appointments', 'Other']
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: false
    },
    time: {
      type: Date
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
eventSchema.index({ user: 1, date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'reminder.enabled': 1 });

module.exports = mongoose.model('Event', eventSchema); 