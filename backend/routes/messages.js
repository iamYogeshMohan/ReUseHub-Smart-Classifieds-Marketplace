const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// @route   GET api/messages/:userId
// @desc    Get messages between current user and userId
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
  const { receiver, text, product } = req.body;
  
  try {
    const newMessage = new Message({
      sender: req.user.id,
      receiver,
      text,
      product
    });

    const message = await newMessage.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/conversations/me
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations/me', auth, async (req, res) => {
  try {
    // Basic implementation: get unique users from messages
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).populate('sender', 'username avatar').populate('receiver', 'username avatar').sort({ createdAt: -1 });
    
    // Group by conversation
    const conversationsMap = {};
    messages.forEach(msg => {
      if (!msg.sender || !msg.receiver) return; // Skip orphaned messages from deleted users

      const otherUser = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;
      if (!otherUser) return;
      
      const otherUserId = otherUser._id.toString();
      
      if (!conversationsMap[otherUserId]) {
        conversationsMap[otherUserId] = {
          user: otherUser,
          lastMessage: msg,
          unreadCount: (msg.receiver._id.toString() === req.user.id && !msg.read) ? 1 : 0
        };
      } else {
        if (msg.receiver._id.toString() === req.user.id && !msg.read) {
          conversationsMap[otherUserId].unreadCount += 1;
        }
      }
    });

    res.json(Object.values(conversationsMap));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
