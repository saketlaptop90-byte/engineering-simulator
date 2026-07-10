DROP TABLE IF EXISTS chat_logs;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    email TEXT PRIMARY KEY,
    requests_today INTEGER DEFAULT 0,
    last_reset_time INTEGER
);

CREATE TABLE chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    prompt TEXT,
    response TEXT,
    timestamp INTEGER
);
