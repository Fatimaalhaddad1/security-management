const { pool } = require('../config/db');

async function findAllBySite(siteId) {
  const result = await pool.query(
    `SELECT mr.* FROM maintenance_records mr
     JOIN assets a ON mr.asset_id = a.id
     WHERE a.site_id = $1
     ORDER BY mr.date DESC, mr.id DESC`,
    [siteId]
  );
  return result.rows;
}

async function findByIdAndSite(id, siteId) {
  const result = await pool.query(
    `SELECT mr.* FROM maintenance_records mr
     JOIN assets a ON mr.asset_id = a.id
     WHERE mr.id = $1 AND a.site_id = $2`,
    [id, siteId]
  );
  return result.rows[0] || null;
}

async function create(data, technicianId) {
  const result = await pool.query(
    `INSERT INTO maintenance_records (asset_id, maintenance_type, date, description, technician_id)
     VALUES ($1, $2, CURRENT_DATE, $3, $4)
     RETURNING id`,
    [data.asset_id, data.maintenance_type, data.description, technicianId]
  );
  return result.rows[0];
}

async function update(id, siteId, data) {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  const allowed = ['maintenance_type', 'description'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      updates.push(`${key} = $${paramIndex}`);
      values.push(data[key]);
      paramIndex++;
    }
  }

  if (updates.length === 0) return null;

  values.push(id, siteId);

  const result = await pool.query(
    `UPDATE maintenance_records SET ${updates.join(', ')}
     WHERE id = $${paramIndex}
     AND asset_id IN (SELECT id FROM assets WHERE site_id = $${paramIndex + 1})
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

async function remove(id, siteId) {
  const result = await pool.query(
    `DELETE FROM maintenance_records
     WHERE id = $1
     AND asset_id IN (SELECT id FROM assets WHERE site_id = $2)
     RETURNING id`,
    [id, siteId]
  );
  return result.rowCount > 0;
}

module.exports = {
  findAllBySite,
  findByIdAndSite,
  create,
  update,
  remove,
};
