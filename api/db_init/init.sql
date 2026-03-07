CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE worlds (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE backstories (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    character_name TEXT NOT NULL,
    content TEXT NOT NULL,
    world_id INTEGER REFERENCES worlds(id)
);