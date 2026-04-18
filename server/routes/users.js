const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ trustScore: -1, requestsSolved: -1 })
      .limit(20)
      .select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (admin)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (onboarding + profile)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, skills, interests, location, bio, avatar, onboarded } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (skills) updateData.skills = skills;
    if (interests) updateData.interests = interests;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (onboarded !== undefined) updateData.onboarded = onboarded;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    
    // Check for badge eligibility
    if (user.requestsSolved >= 1 && !user.badges.find(b => b.name === 'First Solve')) {
      user.badges.push({ name: 'First Solve', icon: '🏅' });
      await user.save();
    }
    if (user.helpOffered >= 5 && !user.badges.find(b => b.name === 'Helpful Hand')) {
      user.badges.push({ name: 'Helpful Hand', icon: '🤝' });
      await user.save();
    }
    if (user.trustScore >= 50 && !user.badges.find(b => b.name === 'Trusted Member')) {
      user.badges.push({ name: 'Trusted Member', icon: '⭐' });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
