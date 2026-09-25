PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "subscribers" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    type TEXT NOT NULL,
    confirmation_token TEXT,
    token_expires_at TEXT,
    confirmed BOOLEAN DEFAULT false,
    confirmed_at TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(email, type)
);
DELETE FROM sqlite_sequence;
