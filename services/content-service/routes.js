const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../../user-service/middleware/auth');

// @route   GET api/content/pillars
// @desc    Get all pillars
// @access  Public
router.get('/pillars', async (req, res) => {
  try {
    // Get all pillars from database
    const pillars = await Content.find({ type: 'pillar' }).sort({ order: 1 });
    res.json(pillars);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/content/pillar/:id
// @desc    Get pillar by ID
// @access  Public
router.get('/pillar/:id', async (req, res) => {
  try {
    // Get pillar from database
    const pillar = await Content.findOne({ type: 'pillar', pillarId: req.params.id });
    if (!pillar) {
      return res.status(404).json({ msg: 'Pillar not found' });
    }
    res.json(pillar);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/content/techniques/:pillarId
// @desc    Get techniques by pillar ID
// @access  Public
router.get('/techniques/:pillarId', async (req, res) => {
  try {
    // Get techniques for pillar from database
    const techniques = await Content.find({ 
      type: 'technique', 
      pillarId: req.params.pillarId 
    }).sort({ order: 1 });
    
    res.json(techniques);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/content/technique/:id
// @desc    Get technique by ID
// @access  Public
router.get('/technique/:id', async (req, res) => {
  try {
    // Get technique from database
    const technique = await Content.findById(req.params.id);
    if (!technique) {
      return res.status(404).json({ msg: 'Technique not found' });
    }
    res.json(technique);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/content/age-group/:group
// @desc    Get content by age group
// @access  Public
router.get('/age-group/:group', async (req, res) => {
  try {
    // Get content for age group from database
    const content = await Content.find({ 
      ageGroups: req.params.group 
    }).sort({ type: 1, order: 1 });
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/content
// @desc    Create new content
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, pillarId, ageGroups, content, order } = req.body;

    // Create new content
    const newContent = new Content({
      title,
      description,
      type,
      pillarId,
      ageGroups,
      content,
      order
    });

    // Save content to database
    const savedContent = await newContent.save();
    res.json(savedContent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
