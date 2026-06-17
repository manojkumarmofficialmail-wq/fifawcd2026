const db = require('../db');

// POST /api/register
async function register(req, res) {
  try {
    let { full_name, designation, section, whatsapp, team } = req.body || {};

    // ---- Normalise ----
    full_name = (full_name || '').trim();
    designation = (designation || '').trim();
    section = (section || '').trim();
    whatsapp = (whatsapp || '').trim();
    team = (team || '').trim();

    // ---- Required fields ----
    if (!full_name || !designation || !section || !whatsapp || !team) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // ---- WhatsApp numeric validation (10–15 digits) ----
    if (!/^\d{10,15}$/.test(whatsapp)) {
      return res
        .status(400)
        .json({ error: 'WhatsApp number must contain only digits (10–15).' });
    }

    // ---- Prediction window check ----
    const settingsRes = await db.query(
      'SELECT start_time, end_time FROM admin_settings WHERE id = 1'
    );
    const settings = settingsRes.rows[0];
    const now = new Date();

    if (settings && settings.start_time && now < new Date(settings.start_time)) {
      return res
        .status(403)
        .json({ error: 'The prediction window has not opened yet.' });
    }
    if (settings && settings.end_time && now > new Date(settings.end_time)) {
      return res
        .status(403)
        .json({ error: 'The prediction window has closed. Late entries are not accepted.' });
    }

    // ---- Team must exist and still be in the contest ----
    const teamRes = await db.query(
      'SELECT name, is_eliminated FROM teams WHERE name = $1',
      [team]
    );
    if (teamRes.rowCount === 0) {
      return res.status(400).json({ error: 'Selected team is not valid.' });
    }
    if (teamRes.rows[0].is_eliminated) {
      return res
        .status(400)
        .json({ error: 'That team is already eliminated. Please pick a team still in the contest.' });
    }

    // ---- Duplicate guard (same WhatsApp number) ----
    const dupRes = await db.query(
      'SELECT id FROM users WHERE whatsapp = $1',
      [whatsapp]
    );
    if (dupRes.rowCount > 0) {
      return res
        .status(409)
        .json({ error: 'This WhatsApp number has already submitted a prediction.' });
    }

    // ---- Insert ----
    const insertRes = await db.query(
      `INSERT INTO users (full_name, designation, section, whatsapp, team)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, team, status, created_at`,
      [full_name, designation, section, whatsapp, team]
    );

    return res.status(201).json({
      message: 'Prediction submitted successfully.',
      user: insertRes.rows[0],
    });
  } catch (err) {
    // Unique violation safety net
    if (err.code === '23505') {
      return res
        .status(409)
        .json({ error: 'This WhatsApp number has already submitted a prediction.' });
    }
    console.error('register error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = { register };
