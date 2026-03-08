const bcrypt = require('bcrypt');
const authRepository = require('../repositories/auth.repository');
const { generateToken } = require('../utils/jwt');
const { validateLogin } = require('../utils/validators');

async function login(req, res) {
  try {
    const errors = validateLogin(req.body);
    if (errors) {
      return res.status(400).json({ errors });
    }

    const { email, password } = req.body;
    const user = await authRepository.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      user_id: user.id,
      role: user.role,
      site_id: user.site_id,
    });

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        site_id: user.site_id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { login };
