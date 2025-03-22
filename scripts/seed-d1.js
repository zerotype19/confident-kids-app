const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const execAsync = promisify(exec);

function escapeSql(str) {
  return str.replace(/'/g, "''").replace(/"/g, '""');
}

function escapeShell(str) {
  return `"${str.replace(/"/g, '\\"')}"`;
}

async function main() {
  try {
    // Create SQL for pillars
    let sql = '';
    
    // Insert pillar data
    const pillars = [
      {
        id: 1,
        name: 'Independence & Problem-Solving',
        slug: 'independence-problem-solving',
        description: 'Help your child develop independence and problem-solving skills.',
        icon: '🎯',
        color: '#4299E1'
      },
      {
        id: 2,
        name: 'Growth Mindset',
        slug: 'growth-mindset',
        description: 'Help your child develop a growth mindset.',
        icon: '🌱',
        color: '#48BB78'
      },
      {
        id: 3,
        name: 'Social Confidence',
        slug: 'social-confidence',
        description: 'Help your child build social confidence.',
        icon: '👥',
        color: '#F6AD55'
      },
      {
        id: 4,
        name: 'Self-Awareness',
        slug: 'self-awareness',
        description: 'Help your child develop self-awareness.',
        icon: '🧠',
        color: '#9F7AEA'
      },
      {
        id: 5,
        name: 'Emotional Resilience',
        slug: 'emotional-resilience',
        description: 'Help your child develop emotional resilience.',
        icon: '❤️',
        color: '#F56565'
      }
    ];

    // Add pillar inserts
    for (const pillar of pillars) {
      sql += `INSERT OR REPLACE INTO pillars (id, name, slug, description, icon, color) VALUES (${pillar.id}, '${escapeSql(pillar.name)}', '${escapeSql(pillar.slug)}', '${escapeSql(pillar.description)}', '${escapeSql(pillar.icon)}', '${escapeSql(pillar.color)}');\n`;
    }

    // Insert techniques
    const techniques = [
      {
        id: 'tech1',
        pillarId: 1,
        title: 'The "Ask, Don\'t Tell" Method',
        description: 'A technique to foster independence by asking questions instead of giving answers',
        instructions: 'Instead of telling your child what to do, ask questions that guide them to find solutions on their own.',
        ageGroups: {
          toddler: 'Use simple questions appropriate for their understanding.',
          elementary: 'Ask more complex questions that encourage critical thinking.',
          teen: 'Guide them to resources where they can find answers independently.'
        }
      },
      {
        id: 'tech2',
        pillarId: 2,
        title: 'The "Yet" Technique',
        description: 'A technique to foster a growth mindset by adding "yet" to statements',
        instructions: 'When your child says "I can\'t do this," encourage them to add "yet" to the end.',
        ageGroups: {
          toddler: 'Use simple language to introduce the concept of "not yet".',
          elementary: 'Help them understand that abilities can grow with practice.',
          teen: 'Connect the concept to their personal goals and aspirations.'
        }
      }
    ];

    // Add technique inserts
    for (const technique of techniques) {
      for (const [ageGroup, content] of Object.entries(technique.ageGroups)) {
        const contentData = JSON.stringify({
          instructions: technique.instructions,
          content: content
        });

        sql += `INSERT OR REPLACE INTO content (id, pillar_id, title, description, age_group, content_type, content_data) VALUES ('${escapeSql(technique.id)}_${escapeSql(ageGroup)}', ${technique.pillarId}, '${escapeSql(technique.title)}', '${escapeSql(technique.description)}', '${escapeSql(ageGroup)}', 'technique', '${escapeSql(contentData)}');\n`;
      }
    }

    // Write SQL to file
    await fs.writeFile('migrations/seed.sql', sql);

    // Execute SQL file
    await execAsync('wrangler d1 execute confident-kids-db --file=migrations/seed.sql');
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main(); 