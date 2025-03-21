-- Migration: Create pillars table
CREATE TABLE pillars (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Insert pillar data from the '/api/content/pillars' endpoint
INSERT INTO pillars (id, name, description, short_description, created_at) VALUES 
(1, 'Independence & Problem-Solving', 'Help your child develop independence and problem-solving skills.', 'Building independence through guided problem-solving', strftime('%s', 'now') * 1000),
(2, 'Growth Mindset & Resilience', 'Foster a growth mindset and resilience in your child.', 'Developing resilience and a positive growth mindset', strftime('%s', 'now') * 1000),
(3, 'Social Confidence & Communication', 'Build social confidence and communication skills.', 'Enhancing social skills and communication abilities', strftime('%s', 'now') * 1000),
(4, 'Purpose & Strength Discovery', 'Help your child discover their purpose and strengths.', 'Discovering personal strengths and purpose', strftime('%s', 'now') * 1000),
(5, 'Managing Fear & Anxiety', 'Help your child manage fear and anxiety.', 'Learning to manage and overcome fears and anxiety', strftime('%s', 'now') * 1000);

-- Create index for faster lookups
CREATE INDEX idx_pillars_id ON pillars(id);
