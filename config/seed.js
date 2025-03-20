// MongoDB seed data for initial content
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../services/user-service/models/User');
const Content = require('../services/content-service/models/Content');
const Challenge = require('../services/challenge-service/models/Challenge');
const Progress = require('../services/progress-service/models/Progress');
const Notification = require('../services/notification-service/models/Notification');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed data for pillars
const pillars = [
  {
    title: 'Independence & Problem-Solving',
    description: 'Help your child develop independence and problem-solving skills',
    type: 'pillar',
    content: 'This pillar focuses on helping your child develop independence and problem-solving skills through the "Ask, Don\'t Tell" method and real-life scenarios.',
    order: 1,
    ageGroups: ['toddler', 'elementary', 'teen']
  },
  {
    title: 'Growth Mindset & Resilience',
    description: 'Foster a growth mindset and resilience in your child',
    type: 'pillar',
    content: 'This pillar focuses on fostering a growth mindset and resilience in your child through the "Yet" technique and real-life scenarios.',
    order: 2,
    ageGroups: ['toddler', 'elementary', 'teen']
  },
  {
    title: 'Social Confidence & Communication',
    description: 'Build social confidence and communication skills',
    type: 'pillar',
    content: 'This pillar focuses on building social confidence and communication skills through the "Conversation Challenge" and real-life scenarios.',
    order: 3,
    ageGroups: ['toddler', 'elementary', 'teen']
  },
  {
    title: 'Purpose & Strength Discovery',
    description: 'Help your child discover their purpose and strengths',
    type: 'pillar',
    content: 'This pillar focuses on helping your child discover their purpose and strengths through the "Strength Journal" exercise and real-life scenarios.',
    order: 4,
    ageGroups: ['toddler', 'elementary', 'teen']
  },
  {
    title: 'Managing Fear & Anxiety',
    description: 'Help your child manage fear and anxiety',
    type: 'pillar',
    content: 'This pillar focuses on helping your child manage fear and anxiety through the "Reframe the Fear" technique and real-life scenarios.',
    order: 5,
    ageGroups: ['toddler', 'elementary', 'teen']
  }
];

// Seed data for techniques
const techniques = [
  {
    title: 'The "Ask, Don\'t Tell" Method',
    description: 'A technique to foster independence by asking questions instead of giving answers',
    type: 'technique',
    pillarId: 1,
    content: 'Instead of telling your child what to do, ask questions that guide them to find solutions on their own. For example, instead of saying "Put on your coat, it\'s cold outside," ask "What do you think you should wear for this weather?"',
    order: 1,
    ageGroups: ['toddler', 'elementary', 'teen']
  },
  {
    title: 'The "Yet" Technique',
    description: 'A technique to foster a growth mindset by adding "yet" to statements',
    type: 'technique',
    pillarId: 2,
    content: 'When your child says "I can\'t do this," encourage them to add "yet" to the end: "I can\'t do this yet." This simple addition transforms a fixed mindset statement into a growth mindset statement.',
    order: 1,
    ageGroups: ['toddler', 'elementary', 'teen']
  },
  {
    title: 'The "Conversation Challenge"',
    description: 'A technique to build social confidence through conversation practice',
    type: 'technique',
    pillarId: 3,
    content: 'Challenge your child to start or join a conversation with someone new each day. Start small with familiar people and gradually increase the challenge.',
    order: 1,
    ageGroups: ['elementary', 'teen']
  },
  {
    title: 'The "Strength Journal" Exercise',
    description: 'An exercise to help children identify and develop their strengths',
    type: 'technique',
    pillarId: 4,
    content: 'Have your child keep a journal where they record their strengths, accomplishments, and things they enjoy doing. Review it regularly to help them recognize patterns and develop their unique strengths.',
    order: 1,
    ageGroups: ['elementary', 'teen']
  },
  {
    title: 'The "Reframe the Fear" Technique',
    description: 'A technique to help children manage fear and anxiety',
    type: 'technique',
    pillarId: 5,
    content: 'Help your child reframe their fears by asking questions like "What\'s the worst that could happen?" and "How likely is that to happen?" and "What could you do if that happened?" This helps them put their fears in perspective and develop coping strategies.',
    order: 1,
    ageGroups: ['elementary', 'teen']
  }
];

// Seed data for challenges
const challenges = [
  {
    title: 'Daily Independence Challenge',
    description: 'A daily challenge to foster independence',
    content: 'Today, let your child choose their own outfit and dress themselves without help.',
    type: 'daily',
    pillarId: 1,
    ageGroups: ['toddler']
  },
  {
    title: 'Growth Mindset Challenge',
    description: 'A challenge to foster a growth mindset',
    content: 'When your child faces a difficult task today, remind them to say "I can\'t do this yet" instead of "I can\'t do this."',
    type: 'daily',
    pillarId: 2,
    ageGroups: ['elementary']
  },
  {
    title: 'Social Confidence Challenge',
    description: 'A challenge to build social confidence',
    content: 'Challenge your teen to introduce themselves to someone new at school or in an extracurricular activity.',
    type: 'daily',
    pillarId: 3,
    ageGroups: ['teen']
  },
  {
    title: '30-Day Confidence Challenge',
    description: 'A 30-day challenge calendar for parents',
    content: 'Day 1: Ask your child to teach you something they know how to do.',
    type: 'calendar',
    day: 1,
    ageGroups: ['all']
  },
  {
    title: '30-Day Confidence Challenge',
    description: 'A 30-day challenge calendar for parents',
    content: 'Day 2: Help your child set a small, achievable goal for the day.',
    type: 'calendar',
    day: 2,
    ageGroups: ['all']
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});
    await Challenge.deleteMany({});
    await Progress.deleteMany({});
    await Notification.deleteMany({});

    console.log('Database cleared');

    // Seed pillars
    await Content.insertMany(pillars);
    console.log('Pillars seeded');

    // Seed techniques
    await Content.insertMany(techniques);
    console.log('Techniques seeded');

    // Seed challenges
    await Challenge.insertMany(challenges);
    console.log('Challenges seeded');

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
