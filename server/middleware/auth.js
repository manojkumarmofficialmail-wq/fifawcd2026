// Simple shared-key guard for admin routes.
// The admin panel sends the key in the "x-admin-key" header.
// Suitable for an internal department tool; swap for JWT/SSO if needed.

module.exports = function requireAdmin(req, res, next) {
  const provided = req.get('x-admin-key');
  const expected = process.env.ADMIN_KEY || 'wcd-admin-2026';

  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin key.' });
  }
  next();
};
