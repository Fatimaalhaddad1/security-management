const { pool } = require('../config/db');

async function findByEmail(email) {
  const result = await pool.query(
    'SELECT id, full_name, email, password_hash, role, site_id FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

module.exports = { findByEmail };
