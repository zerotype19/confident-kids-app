-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL
) ;

-- Children table
CREATE TABLE children (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  age_group TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Content table
CREATE TABLE content (
  id TEXT PRIMARY KEY,
  pillar_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  age_group TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_data TEXT NOT NULL
);

-- Progress table
CREATE TABLE progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  pillar_id INTEGER NOT NULL,
  technique_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  completed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Challenges table
CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  pillar_id INTEGER NOT NULL,
  day INTEGER NOT NULL,
  age_group TEXT NOT NULL
);

-- Challenge completions table
CREATE TABLE challenge_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (child_id) REFERENCES children(id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);
