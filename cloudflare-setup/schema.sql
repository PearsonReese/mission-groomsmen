-- Cloudflare D1 Database Schema for Mission Groomsmen

-- User sessions table
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    completed_mission BOOLEAN DEFAULT FALSE,
    game_state TEXT,
    easter_eggs_activated TEXT, -- JSON array
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Groom advice submissions
CREATE TABLE groom_advice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    advice_text TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

-- Analytics events for easter eggs and special interactions
CREATE TABLE analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'easter_egg', 'mission_complete', 'audio_play', etc.
    event_data TEXT, -- JSON data
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

-- Indexes for performance
CREATE INDEX idx_user_sessions_name ON user_sessions(user_name);
CREATE INDEX idx_user_sessions_completed ON user_sessions(completed_mission);
CREATE INDEX idx_groom_advice_session ON groom_advice(session_id);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);