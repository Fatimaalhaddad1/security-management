const { pool } = require('../config/db');

async function findAll() {
  const result = await pool.query('SELECT id, name FROM sites ORDER BY id');
  return result.rows;
}

async function findById(id) {
  const result = await pool.query('SELECT id FROM sites WHERE id = $1', [id]);
  return result.rows[0] || null;
}

module.exports = { findAll, findById };
