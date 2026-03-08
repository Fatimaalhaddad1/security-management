const { pool } = require('../config/db');

async function findAllBySite(siteId) {
  if (siteId === null || siteId === undefined) {
    const result = await pool.query('SELECT * FROM assets ORDER BY id');
    return result.rows;
  }
  const result = await pool.query(
    'SELECT * FROM assets WHERE site_id = $1 ORDER BY id',
    [siteId]
  );
  return result.rows;
}

async function findByIdAndSite(id, siteId) {
  if (siteId === null || siteId === undefined) {
    const result = await pool.query('SELECT * FROM assets WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
  const result = await pool.query(
    'SELECT * FROM assets WHERE id = $1 AND site_id = $2',
    [id, siteId]
  );
  return result.rows[0] || null;
}

async function findDailyChecksByAssetId(assetId) {
  const result = await pool.query(
    'SELECT * FROM daily_checks WHERE asset_id = $1 ORDER BY date DESC',
    [assetId]
  );
  return result.rows;
}

async function findMaintenanceByAssetId(assetId) {
  const result = await pool.query(
    'SELECT * FROM maintenance_records WHERE asset_id = $1 ORDER BY date DESC',
    [assetId]
  );
  return result.rows;
}

async function create(data, siteId) {
  const result = await pool.query(
    `INSERT INTO assets (
      facility_number, serial_number, device_type, manufacturer, model,
      production_year, site_id, location, operational_status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      data.facility_number,
      data.serial_number,
      data.device_type,
      data.manufacturer,
      data.model,
      data.production_year,
      siteId,
      data.location,
      data.operational_status,
    ]
  );
  return result.rows[0];
}

async function update(id, siteId, data) {
  if (siteId === null || siteId === undefined) {
    const updates = [];
    const values = [];
    let paramIndex = 1;
    const allowed = [
      'facility_number', 'serial_number', 'device_type', 'manufacturer',
      'model', 'production_year', 'location', 'operational_status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(data[key]);
        paramIndex++;
      }
    }
    if (updates.length === 0) return null;
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    const result = await pool.query(
      `UPDATE assets SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }
  const updates = [];
  const values = [];
  let paramIndex = 1;

  const allowed = [
    'facility_number',
    'serial_number',
    'device_type',
    'manufacturer',
    'model',
    'production_year',
    'location',
    'operational_status',
  ];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      updates.push(`${key} = $${paramIndex}`);
      values.push(data[key]);
      paramIndex++;
    }
  }

  if (updates.length === 0) return null;

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id, siteId);

  const result = await pool.query(
    `UPDATE assets SET ${updates.join(', ')}
     WHERE id = $${paramIndex} AND site_id = $${paramIndex + 1}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

async function remove(id, siteId) {
  if (siteId === null || siteId === undefined) {
    const result = await pool.query('DELETE FROM assets WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  }
  const result = await pool.query(
    'DELETE FROM assets WHERE id = $1 AND site_id = $2 RETURNING id',
    [id, siteId]
  );
  return result.rowCount > 0;
}

module.exports = {
  findAllBySite,
  findByIdAndSite,
  findDailyChecksByAssetId,
  findMaintenanceByAssetId,
  create,
  update,
  remove,
};
