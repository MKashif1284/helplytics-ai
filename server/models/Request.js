const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['open', 'in-progress', 'solved'], default: 'open' },
  aiSummary: { type: String, default: '' },
  aiCategory: { type: String, default: '' },
  aiTags: [{ type: String }],
  aiUrgency: { type: String, default: '' },
  solvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  solvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
