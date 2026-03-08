-- Security Management System - Database Schema
-- Run: psql -d security_management -f database/schema.sql

-- Sites (airports)
CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users (role and site_id nullable until approved by super_admin)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20),
  site_id INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  approved_by INTEGER,
  approved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  CHECK (role IS NULL OR role IN ('super_admin', 'admin', 'inspector', 'technician')),
  CHECK (status IN ('pending', 'approved')),
  CHECK (
    (status = 'pending' AND approved_by IS NULL AND approved_at IS NULL) OR
    (status = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
  )
);

-- Assets (security devices)
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  facility_number VARCHAR(50) NOT NULL,
  serial_number VARCHAR(100) NOT NULL,
  device_type VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  production_year INTEGER NOT NULL,
  site_id INTEGER NOT NULL,
  location VARCHAR(100) NOT NULL,
  operational_status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES sites(id),
  UNIQUE(site_id, serial_number),
  CHECK (operational_status IN ('Operating', 'Not Ready', 'Decommissioned'))
);

-- Daily checks (inspections)
CREATE TABLE daily_checks (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  remarks TEXT,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE(asset_id, date),
  CHECK (status IN ('Operating', 'Not Ready', 'Decommissioned'))
);

-- Maintenance records
CREATE TABLE maintenance_records (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL,
  maintenance_type VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  technician_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (technician_id) REFERENCES users(id),
  CHECK (maintenance_type IN ('Preventive', 'Corrective'))
);
