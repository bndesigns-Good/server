SET TIMEZONE TO 'America/Chicago';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    password VARCHAR,
    name VARCHAR,
    pronouns VARCHAR,
    bio VARCHAR,
    photo_url VARCHAR,
    added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offers
(
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    category VARCHAR,
    price INT,
    description VARCHAR,
    user_id INT REFERENCES users(id),
    added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);