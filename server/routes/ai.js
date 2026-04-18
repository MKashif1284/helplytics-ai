const router = require('express').Router();
const Request = require('../models/Request');
const User = require('../models/User');
const auth = require('../middleware/auth');
const ai = require('../services/aiEngine');

// Auto categorize
router.post('/categorize', (req, res) => {
  const { title, description } = req.body;
  const category = ai.detectCategory(title || '', description || '');
  res.json({ category });
});

// Suggest tags
router.post('/tags', (req, res) => {
  const { title, description } = req.body;
  const tags = ai.suggestTags(title || '', description || '');
  res.json({ tags });
});

// Detect urgency
router.post('/urgency', (req, res) => {
  const { title, description } = req.body;
  const urgency = ai.detectUrgency(title || '', description || '');
  res.json({ urgency });
});

// Rewrite description
router.post('/rewrite', (req, res) => {
  const { description } = req.body;
  const rewritten = ai.rewriteDescription(description || '');
  res.json({ rewritten });
});

// Generate summary
router.post('/summary', (req, res) => {
  const { title, description } = req.body;
  const summary = ai.generateSummary(title || '', description || '');
  res.json({ summary });
});

// Get trends
router.get('/trends', async (req, res) => {
  try {
    const requests = await Request.find();
    const trends = ai.analyzeTrends(requests);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recommendations for user
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const requests = await Request.find({ status: 'open' })
      .populate('author', 'name avatar trustScore');
    const recommendations = ai.getRecommendations(user.skills, requests);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Suggest skills based on interests
router.post('/suggest-skills', (req, res) => {
  const { interests } = req.body;
  const skills = ai.suggestSkills(interests || []);
  res.json({ skills });
});

// Suggest help areas based on skills
router.post('/suggest-help-areas', (req, res) => {
  const { skills } = req.body;
  const areas = ai.suggestHelpAreas(skills || []);
  res.json({ areas });
});

module.exports = router;
