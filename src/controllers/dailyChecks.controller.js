const dailyChecksRepository = require('../repositories/dailyChecks.repository');
const assetsRepository = require('../repositories/assets.repository');
const { validateRecordDailyCheck, validateUpdateDailyCheck } = require('../utils/validators');

async function list(req, res) {
  try {
    const checks = await dailyChecksRepository.findAllBySite(req.user.site_id);
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid daily check id' });
    }

    const check = await dailyChecksRepository.findByIdAndSite(id, req.user.site_id);
    if (!check) {
      return res.status(404).json({ error: 'Daily check not found' });
    }

    res.json(check);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function create(req, res) {
  try {
    const errors = validateRecordDailyCheck(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const assetId = parseInt(req.body.asset_id, 10);
    if (isNaN(assetId)) {
      return res.status(400).json({ error: 'Invalid asset_id' });
    }

    const asset = await assetsRepository.findByIdAndSite(assetId, req.user.site_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const result = await dailyChecksRepository.create(
      { asset_id: assetId, status: req.body.status, remarks: req.body.remarks },
      req.user.user_id
    );

    res.status(201).json({
      message: 'Daily inspection recorded successfully',
      inspection_id: result.id,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Daily check already exists for this asset on this date' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid daily check id' });
    }

    const allowedFields = ['status', 'remarks'];
    const hasUpdates = Object.keys(req.body).some((k) => allowedFields.includes(k));
    if (!hasUpdates) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const errors = validateUpdateDailyCheck(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const check = await dailyChecksRepository.update(id, req.user.site_id, req.body);
    if (!check) {
      return res.status(404).json({ error: 'Daily check not found' });
    }

    res.json(check);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid daily check id' });
    }

    const deleted = await dailyChecksRepository.remove(id, req.user.site_id);
    if (!deleted) {
      return res.status(404).json({ error: 'Daily check not found' });
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
