const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

// Create progress entry for a challenge
router.post('/', auth, async (req, res) => {
  try {
    const { childId, pillarId, activityId, rating, notes } = req.body;

    // Verify the child belongs to the user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId: req.user.id,
      },
    });

    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create progress entry
    const progress = await prisma.progress.create({
      data: {
        childId,
        pillarId,
        activityId,
        rating,
        notes,
      },
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error creating progress entry', error: error.message });
  }
});

// Get progress for a child
router.get('/child/:childId', auth, async (req, res) => {
  try {
    const { childId } = req.params;

    // Verify the child belongs to the user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId: req.user.id,
      },
    });

    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const progress = await prisma.progress.findMany({
      where: {
        childId,
      },
      include: {
        pillar: true,
        activity: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// Get progress for a specific pillar
router.get('/pillar/:pillarId/child/:childId', auth, async (req, res) => {
  try {
    const { pillarId, childId } = req.params;

    // Verify the child belongs to the user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId: req.user.id,
      },
    });

    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const progress = await prisma.progress.findMany({
      where: {
        childId,
        pillarId: parseInt(pillarId),
      },
      include: {
        activity: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pillar progress', error: error.message });
  }
});

// Get progress statistics for a child
router.get('/stats/child/:childId', auth, async (req, res) => {
  try {
    const { childId } = req.params;

    // Verify the child belongs to the user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId: req.user.id,
      },
    });

    if (!child) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get total completed challenges
    const totalCompleted = await prisma.progress.count({
      where: {
        childId,
      },
    });

    // Get average rating
    const averageRating = await prisma.progress.aggregate({
      where: {
        childId,
      },
      _avg: {
        rating: true,
      },
    });

    // Get progress by pillar
    const progressByPillar = await prisma.progress.groupBy({
      by: ['pillarId'],
      where: {
        childId,
      },
      _count: {
        id: true,
      },
      _avg: {
        rating: true,
      },
    });

    // Get pillar details for the progress data
    const pillarDetails = await Promise.all(
      progressByPillar.map(async (pillarProgress) => {
        const pillar = await prisma.pillar.findUnique({
          where: { id: pillarProgress.pillarId },
        });
        return {
          ...pillarProgress,
          pillar,
        };
      })
    );

    res.json({
      totalCompleted,
      averageRating: averageRating._avg.rating || 0,
      progressByPillar: pillarDetails,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress statistics', error: error.message });
  }
});

module.exports = router; 