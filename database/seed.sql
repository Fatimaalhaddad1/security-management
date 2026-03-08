-- Security Management System - Seed Data
-- Run after schema.sql: psql -d security_management -f database/seed.sql
-- All users have password: password123 (bcrypt hash)

-- Sites
INSERT INTO sites (name) VALUES
  ('Abha Airport'),
  ('Riyadh Airport'),
  ('Dammam Airport');

-- Users (password_hash = bcrypt of 'password123')
INSERT INTO users (full_name, email, password_hash, role, site_id) VALUES
  ('Super Admin', 'superadmin@company.com', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'super_admin', 1),
  ('Admin User', 'admin@abha.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'admin', 1),
  ('Inspector One', 'inspector@abha.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'inspector', 1),
  ('Tech Abha', 'technician@abha.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'technician', 1),
  ('Admin Riyadh', 'admin@riyadh.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'admin', 2),
  ('Inspector Riyadh', 'inspector@riyadh.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'inspector', 2),
  ('Tech Riyadh', 'technician@riyadh.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'technician', 2),
  ('Admin Dammam', 'admin@dammam.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'admin', 3),
  ('Inspector Dammam', 'inspector@dammam.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'inspector', 3),
  ('Tech Dammam', 'technician@dammam.airport', '$2a$10$L4lexBqORPF.Rq6okUuc8.4Tn6ICP3HSrwFGavdDBBZnD.x9hN6UO', 'technician', 3);

-- Assets (site 1 = Abha, site 2 = Riyadh, site 3 = Dammam)
INSERT INTO assets (facility_number, serial_number, device_type, manufacturer, model, production_year, site_id, location, operational_status) VALUES
  ('ABH-X01', 'XRAY-ABH-001', 'X-Ray Scanner', 'Smiths Detection', 'HI-SCAN 6040', 2020, 1, 'Terminal 1 - Gate A', 'Operating'),
  ('ABH-M01', 'WTMD-ABH-001', 'Walk-through Metal Detector', 'Garrett', 'PD 6500i', 2019, 1, 'Terminal 1 - Gate A', 'Operating'),
  ('ABH-H01', 'HHMD-ABH-001', 'Hand-held Metal Detector', 'Garrett', 'Superwand', 2021, 1, 'Terminal 1', 'Operating'),
  ('RUH-X01', 'XRAY-RUH-001', 'X-Ray Scanner', 'Smiths Detection', 'HI-SCAN 6040', 2021, 2, 'Terminal 2 - Checkpoint 1', 'Operating'),
  ('RUH-M01', 'WTMD-RUH-001', 'Walk-through Metal Detector', 'Garrett', 'PD 6500i', 2020, 2, 'Terminal 2 - Checkpoint 1', 'Operating'),
  ('RUH-ETD01', 'ETD-RUH-001', 'Explosive Trace Detector', 'Smiths Detection', 'IONSCAN 600', 2020, 2, 'Terminal 2 - Checkpoint 1', 'Operating'),
  ('DMM-X01', 'XRAY-DMM-001', 'X-Ray Scanner', 'L3Harris', 'NEXUS', 2019, 3, 'Terminal 1 - Main', 'Operating'),
  ('DMM-M01', 'WTMD-DMM-001', 'Walk-through Metal Detector', 'CEIA', 'CMD', 2021, 3, 'Terminal 1 - Main', 'Operating');

-- Daily checks
INSERT INTO daily_checks (asset_id, date, status, remarks, created_by) VALUES
  (1, '2025-03-01', 'Operating', 'All systems nominal', 2),
  (1, '2025-03-02', 'Operating', NULL, 2),
  (2, '2025-03-01', 'Operating', NULL, 2),
  (3, '2025-03-01', 'Not Ready', 'Battery low - replaced', 2),
  (4, '2025-03-01', 'Operating', NULL, 5),
  (5, '2025-03-01', 'Operating', NULL, 5),
  (7, '2025-03-01', 'Operating', 'Calibration checked', 8);

-- Maintenance records
INSERT INTO maintenance_records (asset_id, maintenance_type, date, description, technician_id) VALUES
  (1, 'Preventive', '2025-02-15', 'Routine belt inspection and cleaning', 3),
  (2, 'Preventive', '2025-02-20', 'Sensitivity calibration', 3),
  (3, 'Corrective', '2025-03-01', 'Battery replacement', 3),
  (4, 'Preventive', '2025-02-25', 'Monthly maintenance - conveyor and X-ray source check', 6),
  (7, 'Preventive', '2025-02-28', 'Annual calibration', 9);
