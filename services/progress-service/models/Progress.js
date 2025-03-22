const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pillarId: {
    type: Number,
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  activityType: {
    type: String,
    enum: ['technique', 'scenario', 'exercise', 'challenge'],
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Progress', ProgressSchema);
