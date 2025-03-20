const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  children: [
    {
      name: {
        type: String,
        required: true
      },
      ageGroup: {
        type: String,
        enum: ['toddler', 'elementary', 'teen'],
        required: true
      },
      age: {
        type: Number,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
