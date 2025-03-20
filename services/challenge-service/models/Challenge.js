const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'calendar', 'custom'],
    required: true
  },
  day: {
    type: Number,
    required: function() { return this.type === 'calendar'; }
  },
  pillarId: {
    type: Number
  },
  ageGroups: [{
    type: String,
    enum: ['toddler', 'elementary', 'teen', 'all']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
