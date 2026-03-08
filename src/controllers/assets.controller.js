const assetsRepository = require('../repositories/assets.repository');
const { validateCreateAsset, validateUpdateAsset } = require('../utils/validators');

async function list(req, res) {
  try {
    const assets = await assetsRepository.findAllBySite(req.user.site_id);
    res.json({ assets });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid asset id' });
    }

    const asset = await assetsRepository.findByIdAndSite(id, req.user.site_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const [daily_checks, maintenance_history] = await Promise.all([
      assetsRepository.findDailyChecksByAssetId(id),
      assetsRepository.findMaintenanceByAssetId(id),
    ]);

    res.json({
      asset,
      daily_checks,
      maintenance_history,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function create(req, res) {
  try {
    const errors = validateCreateAsset(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const asset = await assetsRepository.create(req.body, req.user.site_id);
    res.status(201).json({ message: 'Asset created successfully', asset_id: asset.id });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Serial number already exists for this site' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid asset id' });
    }

    const allowedFields = [
      'facility_number', 'serial_number', 'device_type', 'manufacturer',
      'model', 'production_year', 'location', 'operational_status',
    ];
    const hasUpdates = Object.keys(req.body).some((k) => allowedFields.includes(k));
    if (!hasUpdates) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const errors = validateUpdateAsset(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const asset = await assetsRepository.update(id, req.user.site_id, req.body);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset updated successfully' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Serial number already exists for this site' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid asset id' });
    }

    const deleted = await assetsRepository.remove(id, req.user.site_id);
    if (!deleted) {
      return res.status(404).json({ error: 'Asset not found' });
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
