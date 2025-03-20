const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../../user-service/middleware/auth');

// @route   POST api/progress/track
// @desc    Track user progress
// @access  Private
router.post('/track', auth, async (req, res) => {
  try {
    const { pillarId, activityId, activityType, completed, notes } = req.body;

    // Create new progress entry
    const progress = new Progress({
      userId: req.user.id,
      pillarId,
      activityId,
      activityType,
      completed,
      notes
    });

    // Save progress to database
    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/progress/user
// @desc    Get user progress
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // Get user progress from database
    const progress = await Progress.find({ userId: req.user.id }).sort({ completedAt: -1 });
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/progress/pillar/:pillarId
// @desc    Get user progress for a specific pillar
// @access  Private
router.get('/pillar/:pillarId', auth, async (req, res) => {
  try {
    // Get user progress for pillar from database
    const progress = await Progress.find({ 
      userId: req.user.id,
      pillarId: req.params.pillarId
    }).sort({ completedAt: -1 });
    
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/progress/summary
// @desc    Get progress summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    // Get progress summary from database
    const summary = await Progress.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$pillarId', count: { $sum: 1 }, completed: { $sum: { $cond: ['$completed', 1, 0] } } } }
    ]);
    
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/progress/:id
// @desc    Update progress
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { completed, notes } = req.body;

    // Build progress object
    const progressFields = {};
    if (completed !== undefined) progressFields.completed = completed;
    if (notes) progressFields.notes = notes;
    if (completed) progressFields.completedAt = Date.now();

    // Update progress in database
    let progress = await Progress.findById(req.params.id);
    
    if (!progress) {
      return res.status(404).json({ msg: 'Progress not found' });
    }

    // Check user
    if (progress.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    progress = await Progress.findByIdAndUpdate(
      req.params.id,
      { $set: progressFields },
      { new: true }
    );

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
