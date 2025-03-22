-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    criteria_type TEXT NOT NULL,
    criteria_value INTEGER NOT NULL,
    points_value INTEGER NOT NULL,
    creates_certificate BOOLEAN DEFAULT 0,
    created_at DATETIME NOT NULL
);

-- Insert some default achievements
INSERT INTO achievements (id, name, description, criteria_type, criteria_value, points_value, creates_certificate, created_at) VALUES
    ('ach_1', 'First Steps', 'Complete your first challenge', 'challenges_completed', 1, 10, 1, datetime('now')),
    ('ach_2', 'Pillar Master', 'Complete all challenges in a pillar', 'pillar_completed', 1, 50, 1, datetime('now')),
    ('ach_3', 'Weekly Warrior', 'Complete 7 challenges in a week', 'weekly_challenges', 7, 30, 0, datetime('now')),
    ('ach_4', 'Monthly Master', 'Complete 30 challenges in a month', 'monthly_challenges', 30, 100, 1, datetime('now')),
    ('ach_5', 'Social Butterfly', 'Complete 5 social confidence challenges', 'pillar_challenges', 5, 25, 0, datetime('now')),
    ('ach_6', 'Growth Mindset Guru', 'Complete 5 growth mindset challenges', 'pillar_challenges', 5, 25, 0, datetime('now')),
    ('ach_7', 'Independence Expert', 'Complete 5 independence challenges', 'pillar_challenges', 5, 25, 0, datetime('now')),
    ('ach_8', 'Strength Seeker', 'Complete 5 purpose & strength challenges', 'pillar_challenges', 5, 25, 0, datetime('now')),
    ('ach_9', 'Fear Fighter', 'Complete 5 fear & anxiety challenges', 'pillar_challenges', 5, 25, 0, datetime('now')); 