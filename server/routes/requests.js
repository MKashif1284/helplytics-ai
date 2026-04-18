const router = require('express').Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { detectCategory, detectUrgency, suggestTags, generateSummary } = require('../services/aiEngine');

// Get all requests with filters
router.get('/', async (req, res) => {
  try {
    const { category, urgency, status, search, skills, location } = req.query;
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    if (urgency && urgency !== 'all') filter.urgency = urgency;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    if (skills) {
      filter.tags = { $in: skills.split(',') };
    }

    const requests = await Request.find(filter)
      .populate('author', 'name avatar trustScore')
      .populate('helpers', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single request
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('author', 'name avatar trustScore skills badges')
      .populate('helpers', 'name avatar trustScore skills')
      .populate('solvedBy', 'name avatar');
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create request
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, tags, category, urgency } = req.body;
    
    // AI auto-detection
    const aiCategory = detectCategory(title, description);
    const aiUrgency = detectUrgency(title, description);
    const aiTags = suggestTags(title, description);
    const aiSummary = generateSummary(title, description);

    const request = new Request({
      title,
      description,
      category: category || aiCategory,
      urgency: urgency || aiUrgency,
      tags: tags && tags.length > 0 ? tags : aiTags,
      author: req.user.id,
      aiCategory,
      aiUrgency,
      aiTags,
      aiSummary
    });

    await request.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, { $inc: { requestsCreated: 1 } });

    const populated = await Request.findById(request._id)
      .populate('author', 'name avatar trustScore');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Offer help
router.put('/:id/help', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.helpers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already offering help' });
    }

    request.helpers.push(req.user.id);
    if (request.status === 'open') request.status = 'in-progress';
    await request.save();

    // Update helper stats
    await User.findByIdAndUpdate(req.user.id, { $inc: { helpOffered: 1 } });

    // Create notification for request author
    await new Notification({
      user: request.author,
      type: 'help_offered',
      title: 'Someone wants to help!',
      message: `A community member offered help on "${request.title}"`,
      relatedRequest: request._id,
      relatedUser: req.user.id
    }).save();

    const populated = await Request.findById(request._id)
      .populate('author', 'name avatar trustScore')
      .populate('helpers', 'name avatar trustScore');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark as solved
router.put('/:id/solve', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'solved';
    request.solvedBy = req.user.id;
    request.solvedAt = new Date();
    await request.save();

    // Boost trust score for all helpers
    for (const helperId of request.helpers) {
      await User.findByIdAndUpdate(helperId, {
        $inc: { trustScore: 10, requestsSolved: 1 }
      });

      // Notification for helpers
      await new Notification({
        user: helperId,
        type: 'solved',
        title: 'Request solved!',
        message: `"${request.title}" has been marked as solved. +10 trust score!`,
        relatedRequest: request._id
      }).save();
    }

    // Notification for author
    await new Notification({
      user: request.author,
      type: 'solved',
      title: 'Your request is solved!',
      message: `"${request.title}" has been resolved.`,
      relatedRequest: request._id
    }).save();

    const populated = await Request.findById(request._id)
      .populate('author', 'name avatar trustScore')
      .populate('helpers', 'name avatar trustScore')
      .populate('solvedBy', 'name avatar');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete request (admin or author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const user = await User.findById(req.user.id);
    if (request.author.toString() !== req.user.id && !user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
