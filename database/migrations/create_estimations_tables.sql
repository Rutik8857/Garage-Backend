-- Migration: Create estimations and estimation_items tables
-- Description: Creates the necessary tables for storing estimation data,
--              following the recommended database structure.
-- Date: 2025

-- Create estimations table
CREATE TABLE IF NOT EXISTS estimations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobcard_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (jobcard_id) REFERENCES jobcards(id) ON DELETE CASCADE
);

-- Create estimation_items table
CREATE TABLE IF NOT EXISTS estimation_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estimation_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    rate DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estimation_id) REFERENCES estimations(id) ON DELETE CASCADE
);
