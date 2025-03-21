-- First, create the missing pillars table
CREATE TABLE pillars (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL
);

-- Seed data for pillars table
INSERT INTO pillars (id, name, short_description) VALUES 
(1, 'Independence & Problem-Solving', 'Help your child develop independence and problem-solving skills'),
(2, 'Growth Mindset & Resilience', 'Foster a growth mindset and resilience in your child'),
(3, 'Social Confidence & Communication', 'Build social confidence and communication skills'),
(4, 'Purpose & Strength Discovery', 'Help your child discover their purpose and strengths'),
(5, 'Managing Fear & Anxiety', 'Help your child manage fear and anxiety');

-- Seed data for content table (techniques for each pillar)
INSERT INTO content (id, pillar_id, title, description, age_group, content_type, content_data) VALUES
-- Pillar 1: Independence & Problem-Solving
('tech1', 1, 'Ask, Don''t Tell Method', 'Instead of giving direct answers, ask guiding questions that help your child think through problems.', 'all', 'technique', '{"steps": ["When your child asks a question, respond with a guiding question", "Give them time to think and respond", "If needed, provide hints rather than answers", "Praise their problem-solving process"]}'),
('tech2', 1, 'Structured Problem-Solving', 'Teach a step-by-step approach to solving problems independently.', 'all', 'technique', '{"steps": ["Identify the problem clearly", "Brainstorm possible solutions", "Evaluate each solution", "Choose and implement the best solution", "Reflect on the results"]}'),

-- Pillar 2: Growth Mindset & Resilience
('tech3', 2, 'The Power of "Yet"', 'Add the word "yet" to statements about inability to emphasize growth potential.', 'all', 'technique', '{"steps": ["When your child says \"I can''t do this\", add \"yet\" to the end", "Discuss how skills develop over time", "Share examples of things they couldn''t do before but can now", "Celebrate progress, not just success"]}'),
('tech4', 2, 'Celebrating Mistakes', 'Reframe mistakes as valuable learning opportunities.', 'all', 'technique', '{"steps": ["When mistakes happen, respond positively", "Ask \"What did you learn?\"", "Share your own mistakes and lessons", "Praise effort and strategy adjustments"]}'),

-- Pillar 3: Social Confidence & Communication
('tech5', 3, 'Conversation Starters', 'Practice initiating and maintaining conversations.', 'all', 'technique', '{"steps": ["Teach open-ended questions", "Practice active listening", "Role-play different social scenarios", "Gradually increase social challenges"]}'),
('tech6', 3, 'Emotion Vocabulary', 'Expand your child''s emotional vocabulary to express feelings effectively.', 'all', 'technique', '{"steps": ["Introduce new emotion words regularly", "Label emotions in books, movies, and real life", "Validate all emotions", "Discuss healthy ways to express each emotion"]}'),

-- Pillar 4: Purpose & Strength Discovery
('tech7', 4, 'Strength Spotting', 'Help your child identify and develop their natural strengths.', 'all', 'technique', '{"steps": ["Observe what activities energize your child", "Point out specific strengths you notice", "Create opportunities to use these strengths", "Connect strengths to potential future roles"]}'),
('tech8', 4, 'Purpose Exploration', 'Guide your child to discover activities that feel meaningful.', 'all', 'technique', '{"steps": ["Ask what problems they care about solving", "Explore how their strengths could help others", "Try different volunteer activities", "Discuss what gives them a sense of pride"]}'),

-- Pillar 5: Managing Fear & Anxiety
('tech9', 5, 'Brave Breathing', 'Teach calming breathing techniques for anxious moments.', 'all', 'technique', '{"steps": ["Practice deep belly breathing", "Count breaths (in for 4, hold for 2, out for 6)", "Create a calming phrase to repeat", "Practice regularly, not just during anxiety"]}'),
('tech10', 5, 'Worry Time', 'Set aside specific time to address worries, containing anxiety to a limited period.', 'all', 'technique', '{"steps": ["Schedule 10-15 minutes of \"worry time\" each day", "Outside this time, postpone worries to the designated time", "During worry time, write down concerns and possible solutions", "End worry time with a positive activity"]}');

-- Seed data for challenges table
INSERT INTO challenges (id, title, description, pillar_id, day, age_group) VALUES
('chal1', 'Ask, Don''t Tell Challenge', 'When your child asks for help today, respond with a question that helps them solve the problem themselves.', 1, 1, 'all'),
('chal2', 'Growth Mindset Moment', 'Add "yet" to any statement your child makes about not being able to do something.', 2, 2, 'all'),
('chal3', 'Conversation Practice', 'Help your child prepare and practice conversation starters for social situations.', 3, 3, 'all'),
('chal4', 'Strength Spotting', 'Point out three specific strengths you notice in your child today.', 4, 4, 'all'),
('chal5', 'Brave Breathing', 'Practice the brave breathing technique with your child before a challenging situation.', 5, 5, 'all'),
('chal6', 'Problem-Solving Steps', 'When a problem arises today, guide your child through the structured problem-solving steps.', 1, 6, 'all'),
('chal7', 'Mistake Celebration', 'Share a mistake you made and what you learned from it, then invite your child to do the same.', 2, 7, 'all');

-- Seed data for achievements table
INSERT INTO achievements (id, name, description, criteria_type, criteria_value, points_value, creates_certificate, created_at) VALUES
('ach1', 'Problem Solver', 'Complete 5 techniques in the Independence & Problem-Solving pillar', 'techniques_completed', 5, 50, 1, 1742500000000),
('ach2', 'Growth Champion', 'Complete 5 techniques in the Growth Mindset & Resilience pillar', 'techniques_completed', 5, 50, 1, 1742500000000),
('ach3', 'Social Star', 'Complete 5 techniques in the Social Confidence & Communication pillar', 'techniques_completed', 5, 50, 1, 1742500000000),
('ach4', 'Purpose Finder', 'Complete 5 techniques in the Purpose & Strength Discovery pillar', 'techniques_completed', 5, 50, 1, 1742500000000),
('ach5', 'Brave Heart', 'Complete 5 techniques in the Managing Fear & Anxiety pillar', 'techniques_completed', 5, 50, 1, 1742500000000),
('ach6', 'Confidence Builder', 'Complete techniques across all 5 pillars', 'techniques_completed', 10, 100, 1, 1742500000000),
('ach7', 'Challenge Champion', 'Complete 10 daily challenges', 'challenges_completed', 10, 75, 0, 1742500000000);

-- Seed data for rewards table
INSERT INTO rewards (id, name, description, image, points, created_at) VALUES
('rew1', 'Confidence Certificate', 'A personalized certificate celebrating your child''s growth in confidence', '/images/rewards/certificate.png', 100, 1742500000000),
('rew2', 'Confidence Journal', 'A digital journal for recording your child''s confidence journey', '/images/rewards/journal.png', 200, 1742500000000),
('rew3', 'Expert Consultation', 'A 30-minute consultation with a child confidence expert', '/images/rewards/consultation.png', 500, 1742500000000);

-- Add the migration record for the pillars table
INSERT INTO d1_migrations (name, applied_at) VALUES ('0006_create_pillars_table.sql', CURRENT_TIMESTAMP);
