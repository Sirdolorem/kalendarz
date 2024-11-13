CREATE DATABASE calendar_db;

USE calendar_db;

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    event_description TEXT
);
