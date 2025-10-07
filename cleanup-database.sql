-- Remove the custom users table since we're using Supabase Auth
-- This will only work if the table exists and has no foreign key constraints

-- First, check if there are any foreign key references to the users table
-- If there are, you'll need to drop those constraints first

-- Drop the custom users table
DROP TABLE IF EXISTS users CASCADE;

-- Note: If you get foreign key constraint errors, you'll need to:
-- 1. Drop any tables that reference the users table
-- 2. Or remove the foreign key constraints first
-- 3. Then drop the users table
