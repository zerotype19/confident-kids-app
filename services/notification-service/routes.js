const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../../user-service/middleware/auth');

// @route   POST api/notifications/send
// @desc    Send a notification
// @access  Private (Admin only)
router.post('/send', auth, async (req, res) => {
  try {
    const { userId, type, title, message, link } = req.body;

    // Create new notification
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      link
    });

    // Save notification to database
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/notifications/user
// @desc    Get user notifications
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // Get user notifications from database
    const notifications = await Notification.find({ 
      userId: req.user.id,
      read: false
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/notifications/all
// @desc    Get all user notifications
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    // Get all user notifications from database
    const notifications = await Notification.find({ 
      userId: req.user.id
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/notifications/read/:id
// @desc    Mark notification as read
// @access  Private
router.put('/read/:id', auth, async (req, res) => {
  try {
    // Update notification in database
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    
    // Check user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    // Update all notifications in database
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
