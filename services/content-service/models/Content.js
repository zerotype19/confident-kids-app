const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pillar', 'technique', 'scenario', 'exercise'],
    required: true
  },
  pillarId: {
    type: Number,
    required: function() { return this.type !== 'pillar'; }
  },
  ageGroups: [{
    type: String,
    enum: ['toddler', 'elementary', 'teen']
  }],
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', ContentSchema);
