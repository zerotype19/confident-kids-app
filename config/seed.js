const { D1Database } = require('@cloudflare/workers-types');

const seedData = async (env) => {
  // Seed pillars content
  const pillars = [
    {
      id: 1,
      title: 'Independence & Problem-Solving',
      description: 'Help your child develop independence and problem-solving skills.',
      techniques: [
        {
          id: 'tech1',
          title: 'The "Ask, Don\'t Tell" Method',
          description: 'A technique to foster independence by asking questions instead of giving answers',
          instructions: 'Instead of telling your child what to do, ask questions that guide them to find solutions on their own. For example, instead of saying "Put on your coat, it\'s cold outside," ask "What do you think you should wear for this weather?"',
          age_groups: {
            toddler: 'Use simple questions appropriate for their understanding.',
            elementary: 'Ask more complex questions that encourage critical thinking.',
            teen: 'Guide them to resources where they can find answers independently.'
          }
        }
      ]
    },
    {
      id: 2,
      title: 'Growth Mindset',
      description: 'Help your child develop a growth mindset.',
      techniques: [
        {
          id: 'tech2',
          title: 'The "Yet" Technique',
          description: 'A technique to foster a growth mindset by adding "yet" to statements',
          instructions: 'When your child says "I can\'t do this," encourage them to add "yet" to the end: "I can\'t do this yet." This simple addition transforms a fixed mindset statement into a growth mindset statement.',
          age_groups: {
            toddler: 'Use simple language to introduce the concept of "not yet".',
            elementary: 'Help them understand that abilities can grow with practice.',
            teen: 'Connect the concept to their personal goals and aspirations.'
          }
        }
      ]
    },
    {
      id: 3,
      title: 'Social Confidence',
      description: 'Help your child build social confidence.',
      techniques: [
        {
          id: 'tech3',
          title: 'The "Conversation Challenge"',
          description: 'A technique to build social confidence through conversation practice',
          instructions: 'Challenge your child to start or join a conversation with someone new each day. Start small with familiar people and gradually increase the challenge.',
          age_groups: {
            elementary: 'Start with simple greetings and introductions.',
            teen: 'Encourage deeper conversations and active listening.'
          }
        }
      ]
    },
    {
      id: 4,
      title: 'Self-Awareness',
      description: 'Help your child develop self-awareness.',
      techniques: [
        {
          id: 'tech4',
          title: 'The "Strength Journal" Exercise',
          description: 'An exercise to help children identify and develop their strengths',
          instructions: 'Have your child keep a journal where they record their strengths, accomplishments, and things they enjoy doing. Review it regularly to help them recognize patterns and develop their unique strengths.',
          age_groups: {
            elementary: 'Use simple prompts and drawings to record strengths.',
            teen: 'Encourage deeper reflection and goal setting.'
          }
        }
      ]
    },
    {
      id: 5,
      title: 'Emotional Resilience',
      description: 'Help your child develop emotional resilience.',
      techniques: [
        {
          id: 'tech5',
          title: 'The "Reframe the Fear" Technique',
          description: 'A technique to help children manage fear and anxiety',
          instructions: 'Help your child reframe their fears by asking questions like "What\'s the worst that could happen?" and "How likely is that to happen?" and "What could you do if that happened?" This helps them put their fears in perspective and develop coping strategies.',
          age_groups: {
            elementary: 'Use simple language and concrete examples.',
            teen: 'Encourage deeper analysis and problem-solving.'
          }
        }
      ]
    }
  ];
  
  // Insert data into database
  for (const pillar of pillars) {
    // Insert pillar
    await env.DB.prepare(
      'INSERT OR REPLACE INTO pillars (id, title, description) VALUES (?, ?, ?)'
    ).bind(
      pillar.id,
      pillar.title,
      pillar.description
    ).run();

    // Insert techniques
    for (const technique of pillar.techniques) {
      for (const [ageGroup, content] of Object.entries(technique.age_groups)) {
        await env.DB.prepare(
          'INSERT OR REPLACE INTO content (id, pillar_id, title, description, age_group, content_type, content_data) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          `${technique.id}_${ageGroup}`,
          pillar.id,
          technique.title,
          technique.description,
          ageGroup,
          'technique',
          JSON.stringify({
            instructions: technique.instructions,
            content: content
          })
        ).run();
      }
    }
  }
};

module.exports = seedData;
