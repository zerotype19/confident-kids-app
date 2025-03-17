-- Initial database schema for ConfidentKids application

-- Users table (extended from Clerk.dev)
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  subscription_tier TEXT DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Children profiles
CREATE TABLE children (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);

-- Pillars reference table
CREATE TABLE pillars (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

-- Activities
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  pillar_id INTEGER NOT NULL,
  min_age INTEGER NOT NULL,
  max_age INTEGER NOT NULL,
  duration_minutes INTEGER,
  instructions TEXT NOT NULL,
  materials TEXT,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pillar_id) REFERENCES pillars(id)
);

-- Progress tracking
CREATE TABLE progress (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  pillar_id INTEGER NOT NULL,
  activity_id TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  FOREIGN KEY (child_id) REFERENCES children(id),
  FOREIGN KEY (pillar_id) REFERENCES pillars(id),
  FOREIGN KEY (activity_id) REFERENCES activities(id)
);

-- Assessments
CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  pillar_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id),
  FOREIGN KEY (pillar_id) REFERENCES pillars(id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL CHECK(plan_type IN ('basic', 'family', 'premium')),
  status TEXT NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);
