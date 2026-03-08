-- Add super_admin role
-- Run: psql -d security_management -f database/migration_super_admin.sql

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('admin', 'inspector', 'technician', 'super_admin'));
