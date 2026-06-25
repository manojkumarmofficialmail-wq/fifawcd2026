const db = require('../db');

// POST /api/register
async function register(req, res) {
  try {
    let { full_name, designation, section, whatsapp, team } = req.body || {};

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

    // ---- Settings: registration switch + prediction window ----
    const settingsRes = await db.query(
      'SELECT start_time, end_time, show_register FROM admin_settings WHERE id = 1'
    );
    const settings = settingsRes.rows[0];
    const now = new Date();

    if (settings && settings.show_register === false) {
      return res.status(403).json({ error: 'Registration is currently closed.' });
    }
    if (settings && settings.start_time && now < new Date(settings.start_time)) {
      return res.status(403).json({ error: 'The prediction window has not opened yet.' });
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

    // ---- Staff allowlist ----
    // If an employee list has been uploaded, the name + section must match it.
    // If the list is empty, registration is open (no allowlist enforced yet).
    const empCount = await db.query('SELECT COUNT(*)::int AS n FROM employees');
    if (empCount.rows[0].n > 0) {
      const allowed = await db.query(
        `SELECT 1 FROM employees
         WHERE lower(name) = lower($1) AND lower(section) = lower($2)
         LIMIT 1`,
        [full_name, section]
      );
      if (allowed.rowCount === 0) {
        return res.status(403).json({
          error: 'This name was not found in the staff list for that section. Please pick your name from the list, or contact the admin.',
        });
      }
    }

    // ---- Duplicate guard ----
    // Block if the same WhatsApp number OR the same person (name + section)
    // has already submitted.
    const dupRes = await db.query(
      `SELECT whatsapp
       FROM users
       WHERE whatsapp = $1
          OR (lower(full_name) = lower($2) AND lower(section) = lower($3))
       LIMIT 1`,
      [whatsapp, full_name, section]
    );
    if (dupRes.rowCount > 0) {
      const sameNumber = String(dupRes.rows[0].whatsapp) === whatsapp;
      return res.status(409).json({
        error: sameNumber
          ? 'This WhatsApp number has already submitted a prediction.'
          : 'A prediction has already been submitted for this name and section.',
      });
    }

    // ---- Capture submitter's IP and device (for fraud detection) ----
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      '';
    const ua = (req.headers['user-agent'] || '').slice(0, 500);

    // ---- Insert ----
    const insertRes = await db.query(
      `INSERT INTO users (full_name, designation, section, whatsapp, team, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, team, status, created_at`,
      [full_name, designation, section, whatsapp, team, ip || null, ua || null]
    );

    return res.status(201).json({
      message: 'Prediction submitted successfully.',
      user: insertRes.rows[0],
    });
  } catch (err) {
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
