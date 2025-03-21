-- First, create a backup of the existing progress table
CREATE TABLE progress_backup AS SELECT * FROM progress;

-- Drop the existing progress table
DROP TABLE progress;

-- Recreate the progress table with the updated schema
CREATE TABLE IF NOT EXISTS progress (
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

-- Copy data back from the backup
INSERT INTO progress SELECT * FROM progress_backup;

-- Drop the backup table
DROP TABLE progress_backup;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_child_id ON progress(child_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress(completed);
