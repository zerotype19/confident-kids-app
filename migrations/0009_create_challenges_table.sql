-- Create challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    pillar_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pillar_id) REFERENCES pillars(id)
);

-- Insert the pillar first
INSERT OR IGNORE INTO pillars (id, name, slug, description) VALUES
    (1, 'Confidence Building', 'confidence-building', 'Activities to help build self-confidence and self-esteem');

-- Insert initial challenges with difficulty levels
INSERT OR IGNORE INTO challenges (id, pillar_id, title, description, difficulty_level) VALUES
    ('chal1', 1, 'Choose Your Clothes', 'Pick out your clothes for tomorrow all by yourself!', 1),
    ('chal2', 1, 'Growth Mindset Activity', 'Try something new and tell yourself "I can learn this!"', 2),
    ('chal3', 1, 'Morning Routine', 'Complete your morning routine without reminders', 1),
    ('chal4', 1, 'Strength Journal', 'Write down one thing you did well today', 2),
    ('chal5', 1, 'Fear Reframing', 'Think of something that scares you and list three ways to handle it', 3),
    ('chal6', 1, 'Conversation Starter', 'Start a conversation with someone new', 1),
    ('chal7', 1, 'Goal Setting', 'Set a small goal and make a plan to achieve it', 2),
    ('chal8', 1, 'Strength Recognition', 'Tell someone about a strength you used today', 3); 