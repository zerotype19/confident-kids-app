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
          title: 'Ask, Don\'t Tell Method',
          description: 'Instead of giving direct answers, ask guiding questions.',
          instructions: 'When your child asks for help, respond with a question that guides them toward finding the answer themselves.',
          age_groups: {
            toddler: 'Use simple questions appropriate for their understanding.',
            elementary: 'Ask more complex questions that encourage critical thinking.',
            teen: 'Guide them to resources where they can find answers independently.'
          }
        }
        // Add more techniques
      ]
    }
    // Add more pillars
  ];
  
  // Insert data into database
  for (const pillar of pillars) {
    for (const technique of pillar.techniques) {
      for (const [ageGroup, content] of Object.entries(technique.age_groups)) {
        await env.DB.prepare(
          'INSERT INTO content (id, pillar_id, title, description, age_group, content_type, content_data) VALUES (?, ?, ?, ?, ?, ?, ?)'
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
  
  // Seed challenges
  // Similar code for challenges...
};

export default seedData;
