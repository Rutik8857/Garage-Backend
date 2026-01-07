-- Migration: Add reset password fields to users table
-- Description: Adds reset_token and reset_token_expiry columns for password reset functionality
-- Date: 2024

-- Add reset_token column (VARCHAR(255) to store the reset token)
ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255) NULL;

-- Add reset_token_expiry column (DATETIME to store token expiration time)
ALTER TABLE users
ADD COLUMN reset_token_expiry DATETIME NULL;

-- Optional: Add index on reset_token for faster lookups
CREATE INDEX idx_reset_token ON users(reset_token);

-- Verify the changes
-- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'users' 
-- AND COLUMN_NAME IN ('reset_token', 'reset_token_expiry');

