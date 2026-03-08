const { pool } = require('../config/db');

async function findByEmail(email) {
  const result = await pool.query(
    'SELECT id, full_name, email, role, site_id, status FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function assignUser(email, role, siteId, approvedById) {
  const result = await pool.query(
    `UPDATE users
     SET role = $1, site_id = $2, status = 'approved', approved_by = $3, approved_at = CURRENT_TIMESTAMP
     WHERE email = $4
     RETURNING id`,
    [role, siteId, approvedById, email]
  );
  return result.rows[0] || null;
}

module.exports = { findByEmail, assignUser };
