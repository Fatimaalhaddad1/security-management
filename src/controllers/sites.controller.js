const sitesRepository = require('../repositories/sites.repository');

async function list(req, res) {
  try {
    const sites = await sitesRepository.findAll();
    res.json({ sites });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { list };
