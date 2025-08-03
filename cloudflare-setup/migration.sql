-- Migration script to add contact information collection
-- Run this on both local and production databases

-- Step 1: Add new columns to user_sessions table
-- Note: These will fail if columns already exist, but that's okay
ALTER TABLE user_sessions ADD COLUMN email_collected BOOLEAN DEFAULT FALSE;
ALTER TABLE user_sessions ADD COLUMN address_collected BOOLEAN DEFAULT FALSE;

-- Step 2: Create contact_info table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    email_address TEXT,
    mailing_address TEXT,
    email_collected_at DATETIME,
    address_collected_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

-- Step 3: Create indexes for performance (only if they don't exist)
-- Note: These will fail if indexes already exist, but that's okay
CREATE INDEX IF NOT EXISTS idx_contact_info_session ON contact_info(session_id);
CREATE INDEX IF NOT EXISTS idx_contact_info_user ON contact_info(user_name); 