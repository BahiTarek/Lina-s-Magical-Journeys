-- Initial database schema for Itinerary Generator
-- This file creates the necessary tables for storing itineraries and user data

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create days table
CREATE TABLE IF NOT EXISTS days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  itinerary_id TEXT NOT NULL,
  day_number TEXT NOT NULL,
  city TEXT NOT NULL,
  date TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  timing TEXT,
  category TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  theme TEXT DEFAULT 'default',
  enable_maps BOOLEAN DEFAULT true,
  default_template TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (id, email, name) VALUES
('user_1', 'demo@example.com', 'Demo User');

INSERT INTO itineraries (id, title, user_id) VALUES
('itinerary_1', 'European Vacation', 'user_1');

INSERT INTO days (itinerary_id, day_number, city, date) VALUES
('itinerary_1', '1', 'Paris', '2025-05-01'),
('itinerary_1', '2', 'Paris', '2025-05-02'),
('itinerary_1', '3', 'Rome', '2025-05-03');

INSERT INTO activities (day_id, timing, category, description) VALUES
(1, '09:00', 'Sightseeing', 'Eiffel Tower visit'),
(1, '12:30', 'Food', 'Lunch at Café de Paris'),
(1, '15:00', 'Sightseeing', 'Louvre Museum'),
(2, '10:00', 'Sightseeing', 'Notre-Dame Cathedral'),
(2, '13:00', 'Food', 'Lunch at Le Petit Bistro'),
(2, '16:00', 'Shopping', 'Champs-Élysées'),
(3, '09:30', 'Sightseeing', 'Colosseum'),
(3, '13:00', 'Food', 'Lunch at Trattoria Roma'),
(3, '16:00', 'Sightseeing', 'Vatican Museums');

INSERT INTO meals (day_id, meal_type) VALUES
(1, 'lunch'),
(2, 'lunch'),
(3, 'lunch');

INSERT INTO user_preferences (user_id, theme, enable_maps) VALUES
('user_1', 'default', true);
