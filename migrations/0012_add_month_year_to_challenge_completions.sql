-- Add month and year columns to challenge_completions table if they don't exist
ALTER TABLE challenge_completions ADD COLUMN month INTEGER;
ALTER TABLE challenge_completions ADD COLUMN year INTEGER;

-- Update existing records with current month and year
UPDATE challenge_completions 
SET month = strftime('%m', datetime(completed_at/1000, 'unixepoch')),
    year = strftime('%Y', datetime(completed_at/1000, 'unixepoch'))
WHERE month IS NULL OR year IS NULL;

-- Make month and year NOT NULL
ALTER TABLE challenge_completions MODIFY COLUMN month INTEGER NOT NULL;
ALTER TABLE challenge_completions MODIFY COLUMN year INTEGER NOT NULL; 