const { pool } = require('../config/db');

async function findAllBySite(siteId) {
  if (siteId === null || siteId === undefined) {
    const result = await pool.query(
      `SELECT dc.* FROM daily_checks dc
       JOIN assets a ON dc.asset_id = a.id
       ORDER BY dc.date DESC, dc.id DESC`
    );
    return result.rows;
  }
  const result = await pool.query(
    `SELECT dc.* FROM daily_checks dc
     JOIN assets a ON dc.asset_id = a.id
     WHERE a.site_id = $1
     ORDER BY dc.date DESC, dc.id DESC`,
    [siteId]
  );
  return result.rows;
}

async function findByIdAndSite(id, siteId) {
  if (siteId === null || siteId === undefined) {
    const result = await pool.query(
      'SELECT dc.* FROM daily_checks dc WHERE dc.id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
  const result = await pool.query(
    `SELECT dc.* FROM daily_checks dc
     JOIN assets a ON dc.asset_id = a.id
     WHERE dc.id = $1 AND a.site_id = $2`,
    [id, siteId]
  );
  return result.rows[0] || null;
}

async function create(data, createdBy) {
  const result = await pool.query(
    `INSERT INTO daily_checks (asset_id, date, status, remarks, created_by)
     VALUES ($1, CURRENT_DATE, $2, $3, $4)
     RETURNING id`,
    [data.asset_id, data.status, data.remarks || null, createdBy]
  );
  return result.rows[0];
}

async function update(id, siteId, data) {
  if (siteId === null || siteId === undefined) {
    const updates = [];
    const values = [];
    let paramIndex = 1;
    const allowed = ['status', 'remarks'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(data[key]);
        paramIndex++;
      }
    }
    if (updates.length === 0) return null;
    values.push(id);
    const result = await pool.query(
      `UPDATE daily_checks SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }
  const updates = [];
  const values = [];
  let paramIndex = 1;

  const allowed = ['status', 'remarks'];
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
    `UPDATE daily_checks SET ${updates.join(', ')}
     WHERE id = $${paramIndex}
     AND asset_id IN (SELECT id FROM assets WHERE site_id = $${paramIndex + 1})
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

async function remove(id, siteId) {
  if (siteId === null || siteId === undefined) {
    const result = await pool.query('DELETE FROM daily_checks WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  }
  const result = await pool.query(
    `DELETE FROM daily_checks
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
