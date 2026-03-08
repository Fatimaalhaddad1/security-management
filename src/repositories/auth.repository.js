const { pool } = require('../config/db');

async function findByEmail(email) {
  const result = await pool.query(
    'SELECT id, full_name, email, password_hash, role, site_id, status FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function createUser(fullName, email, passwordHash) {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role, site_id, status, approved_by, approved_at)
     VALUES ($1, $2, $3, NULL, NULL, 'pending', NULL, NULL)
     RETURNING id`,
    [fullName, email, passwordHash]
  );
  return result.rows[0];
}

module.exports = { findByEmail, createUser };
