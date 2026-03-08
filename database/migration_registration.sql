-- Add registration and approval flow columns to users table
-- Run: psql -d security_management -f database/migration_registration.sql
-- Use for existing databases. Fresh installs use schema.sql.

-- Drop existing role constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Make role and site_id nullable
ALTER TABLE users ALTER COLUMN role DROP NOT NULL;
ALTER TABLE users ALTER COLUMN site_id DROP NOT NULL;

-- Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'approved';
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Update existing users to approved (they were seeded before registration flow)
UPDATE users SET status = 'approved' WHERE status IS NULL OR status = '';
UPDATE users SET approved_at = created_at WHERE approved_at IS NULL AND status = 'approved';

-- Add constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('pending', 'approved'));

ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IS NULL OR role IN ('super_admin', 'admin', 'inspector', 'technician'));
