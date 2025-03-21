-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria_type TEXT NOT NULL,
  criteria_value INTEGER NOT NULL,
  points_value INTEGER NOT NULL DEFAULT 0,
  creates_certificate BOOLEAN DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  unlocked_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (achievement_id) REFERENCES achievements(id),
  UNIQUE(user_id, achievement_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

-- Create user rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reward_id TEXT NOT NULL,
  redeemed_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reward_id) REFERENCES rewards(id),
  UNIQUE(user_id, reward_id)
);

-- Add points column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_certificates_child_id ON certificates(child_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_reward_id ON user_rewards(reward_id);
