const router = require('express').Router();
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }]
    })
    .populate('from', 'name avatar')
    .populate('to', 'name avatar')
    .sort({ createdAt: -1 });

    // Group by conversation partner
    const convMap = {};
    for (const msg of messages) {
      const partnerId = msg.from._id.toString() === userId 
        ? msg.to._id.toString() 
        : msg.from._id.toString();
      
      if (!convMap[partnerId]) {
        const partner = msg.from._id.toString() === userId ? msg.to : msg.from;
        convMap[partnerId] = {
          partner,
          lastMessage: msg,
          unreadCount: 0
        };
      }
      if (msg.to._id.toString() === userId && !msg.read) {
        convMap[partnerId].unreadCount++;
      }
    }

    res.json(Object.values(convMap));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get messages with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user.id, to: req.params.userId },
        { from: req.params.userId, to: req.user.id }
      ]
    })
    .populate('from', 'name avatar')
    .populate('to', 'name avatar')
    .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { from: req.params.userId, to: req.user.id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { to, content, requestId } = req.body;
    
    const message = new Message({
      from: req.user.id,
      to,
      content,
      requestId
    });

    await message.save();
    
    const populated = await Message.findById(message._id)
      .populate('from', 'name avatar')
      .populate('to', 'name avatar');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
