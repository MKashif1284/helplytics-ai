const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['needHelp', 'canHelp', 'both'], default: 'both' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  location: { type: String, default: '' },
  trustScore: { type: Number, default: 0 },
  badges: [{ 
    name: String, 
    icon: String, 
    earnedAt: { type: Date, default: Date.now } 
  }],
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  onboarded: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  requestsCreated: { type: Number, default: 0 },
  requestsSolved: { type: Number, default: 0 },
  helpOffered: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
