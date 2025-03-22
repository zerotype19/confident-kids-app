const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Progress = require('../../progress-service/models/Progress');
const auth = require('../../user-service/middleware/auth');

// @route   GET api/challenges/daily
// @desc    Get daily challenge
// @access  Private
router.get('/daily', auth, async (req, res) => {
  try {
    // Get user from request
    const userId = req.user.id;
    
    // Get daily challenge from database
    const challenge = await Challenge.findOne({ 
      type: 'daily',
      ageGroups: { $in: ['all'] } // Later we can filter by child's age group
    }).sort({ createdAt: -1 });
    
    if (!challenge) {
      return res.status(404).json({ msg: 'No daily challenge found' });
    }
    
    // Check if user has already completed this challenge
    const completed = await Progress.findOne({
      userId,
      activityId: challenge._id,
      activityType: 'challenge'
    });
    
    res.json({
      challenge,
      completed: completed ? true : false
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/challenges/calendar
// @desc    Get challenge calendar
// @access  Private
router.get('/calendar', auth, async (req, res) => {
  try {
    // Get challenge calendar from database
    const calendar = await Challenge.find({ 
      type: 'calendar' 
    }).sort({ day: 1 });
    
    // Get user's completed challenges
    const userId = req.user.id;
    const completed = await Progress.find({
      userId,
      activityType: 'challenge',
      activityId: { $in: calendar.map(c => c._id) }
    });
    
    // Map completed status to calendar
    const calendarWithStatus = calendar.map(challenge => {
      const isCompleted = completed.some(c => 
        c.activityId.toString() === challenge._id.toString()
      );
      
      return {
        ...challenge._doc,
        completed: isCompleted
      };
    });
    
    res.json(calendarWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/challenges/complete
// @desc    Mark challenge as complete
// @access  Private
router.post('/complete', auth, async (req, res) => {
  try {
    const { challengeId, notes } = req.body;
    
    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = now.getFullYear();
    
    // Check if already completed this month
    const existing = await Progress.findOne({
      userId: req.user.id,
      activityId: challengeId,
      activityType: 'challenge',
      month: currentMonth,
      year: currentYear
    });
    
    if (existing) {
      return res.status(400).json({ msg: 'Challenge already completed this month' });
    }
    
    // Create progress entry with month and year
    const progress = new Progress({
      userId: req.user.id,
      pillarId: challenge.pillarId || 0,
      activityId: challengeId,
      activityType: 'challenge',
      completed: true,
      notes,
      month: currentMonth,
      year: currentYear
    });
    
    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/challenges/custom
// @desc    Get custom challenges for user
// @access  Private
router.get('/custom', auth, async (req, res) => {
  try {
    // Get custom challenges from database
    const challenges = await Challenge.find({ 
      type: 'custom',
      // Later we can filter by child's age group
    }).sort({ createdAt: -1 });
    
    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/challenges/custom
// @desc    Create custom challenge
// @access  Private (Admin only)
router.post('/custom', auth, async (req, res) => {
  try {
    const { title, description, content, pillarId, ageGroups } = req.body;
    
    // Create new challenge
    const challenge = new Challenge({
      title,
      description,
      content,
      type: 'custom',
      pillarId,
      ageGroups
    });
    
    await challenge.save();
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
