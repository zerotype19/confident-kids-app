const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

// Get all pillars
router.get('/', async (req, res) => {
  try {
    const pillars = await prisma.pillar.findMany({
      include: {
        activities: true,
      },
    });
    res.json(pillars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pillars', error: error.message });
  }
});

// Get a specific pillar by ID
router.get('/:id', async (req, res) => {
  try {
    const pillar = await prisma.pillar.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        activities: true,
      },
    });
    
    if (!pillar) {
      return res.status(404).json({ message: 'Pillar not found' });
    }
    
    res.json(pillar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pillar', error: error.message });
  }
});

// Create a new pillar (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const pillar = await prisma.pillar.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
      },
    });
    
    res.status(201).json(pillar);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pillar', error: error.message });
  }
});

// Update a pillar (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const pillar = await prisma.pillar.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        slug,
        description,
        icon,
        color,
      },
    });
    
    res.json(pillar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pillar', error: error.message });
  }
});

// Delete a pillar (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.pillar.delete({
      where: { id: parseInt(req.params.id) },
    });
    
    res.json({ message: 'Pillar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pillar', error: error.message });
  }
});

// Get challenges for a specific pillar
router.get('/:id/challenges', async (req, res) => {
  try {
    const challenges = await prisma.activity.findMany({
      where: { pillarId: parseInt(req.params.id) },
      include: {
        progress: {
          where: {
            childId: req.query.childId,
          },
        },
      },
    });
    
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges', error: error.message });
  }
});

// Create a new challenge for a pillar (admin only)
router.post('/:id/challenges', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      minAge,
      maxAge,
      durationMinutes,
      instructions,
      materials,
      difficulty,
    } = req.body;
    
    const challenge = await prisma.activity.create({
      data: {
        title,
        description,
        pillarId: parseInt(req.params.id),
        minAge,
        maxAge,
        durationMinutes,
        instructions,
        materials,
        difficulty,
      },
    });
    
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error creating challenge', error: error.message });
  }
});

module.exports = router; 