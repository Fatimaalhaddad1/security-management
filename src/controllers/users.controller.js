const usersRepository = require('../repositories/users.repository');
const sitesRepository = require('../repositories/sites.repository');
const { validateUserAssignment } = require('../utils/validators');

async function assign(req, res) {
  try {
    const errors = validateUserAssignment(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const { email, role, site_id } = req.body;
    const siteId = parseInt(site_id, 10);

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const site = await sitesRepository.findById(siteId);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    await usersRepository.assignUser(email, role, siteId, req.user.user_id);

    res.json({ message: 'User approved and assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { assign };
