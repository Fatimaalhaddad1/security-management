const maintenanceRepository = require('../repositories/maintenance.repository');
const assetsRepository = require('../repositories/assets.repository');
const { validateRecordMaintenance, validateUpdateMaintenance } = require('../utils/validators');

async function list(req, res) {
  try {
    const siteId = req.user.role === 'super_admin'
      ? (req.query.site_id ? parseInt(req.query.site_id, 10) : null)
      : req.user.site_id;
    const records = await maintenanceRepository.findAllBySite(isNaN(siteId) ? null : siteId);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid maintenance record id' });
    }

    const siteId = req.user.role === 'super_admin' ? null : req.user.site_id;
    const record = await maintenanceRepository.findByIdAndSite(id, siteId);
    if (!record) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function create(req, res) {
  try {
    const errors = validateRecordMaintenance(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const assetId = parseInt(req.body.asset_id, 10);
    if (isNaN(assetId)) {
      return res.status(400).json({ error: 'Invalid asset_id' });
    }

    const siteId = req.user.role === 'super_admin' ? null : req.user.site_id;
    const asset = await assetsRepository.findByIdAndSite(assetId, siteId);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const result = await maintenanceRepository.create(
      {
        asset_id: assetId,
        maintenance_type: req.body.maintenance_type,
        description: req.body.description,
      },
      req.user.user_id
    );

    res.status(201).json({
      message: 'Maintenance record added',
      maintenance_id: result.id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid maintenance record id' });
    }

    const allowedFields = ['maintenance_type', 'description'];
    const hasUpdates = Object.keys(req.body).some((k) => allowedFields.includes(k));
    if (!hasUpdates) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const errors = validateUpdateMaintenance(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const siteId = req.user.role === 'super_admin' ? null : req.user.site_id;
    const record = await maintenanceRepository.update(id, siteId, req.body);
    if (!record) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid maintenance record id' });
    }

    const siteId = req.user.role === 'super_admin' ? null : req.user.site_id;
    const deleted = await maintenanceRepository.remove(id, siteId);
    if (!deleted) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
