-- Create achievement_completions table
CREATE TABLE IF NOT EXISTS achievement_completions (
    id TEXT PRIMARY KEY,
    achievement_id TEXT NOT NULL,
    child_id TEXT NOT NULL,
    completed_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_achievement_completions_child_id ON achievement_completions(child_id);
CREATE INDEX IF NOT EXISTS idx_achievement_completions_achievement_id ON achievement_completions(achievement_id); 