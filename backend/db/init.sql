-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS myapp_db;
USE myapp_db;

-- Create Items Table
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'General',
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Data (Only if table is newly created)
INSERT INTO items (title, description, category, status, priority)
SELECT * FROM (
  SELECT 'Configure MySQL Connection Pool' AS title, 'Set up connection pool with mysql2 and environment configuration' AS description, 'Database' AS category, 'completed' AS status, 'high' AS priority
  UNION ALL
  SELECT 'Build Express REST API', 'Implement GET, POST, PUT, DELETE routes with controller handling', 'Backend', 'completed', 'high'
  UNION ALL
  SELECT 'Design Responsive Dashboard UI', 'Create glassmorphism styled frontend connecting to backend API', 'Frontend', 'in_progress', 'medium'
  UNION ALL
  SELECT 'Setup Automated Database Health Checks', 'Add connection retry logic and diagnostic API endpoint', 'DevOps', 'pending', 'low'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM items LIMIT 1);
