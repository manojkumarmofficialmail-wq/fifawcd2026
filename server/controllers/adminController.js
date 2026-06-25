const db = require('../db');

// POST /api/admin/login
// Verifies the shared admin key. The middleware already validated the header,
// so reaching here means the key is correct.
async function login(req, res) {
  res.json({ ok: true, message: 'Admin key accepted.' });
}

// GET /api/admin/settings  -> current prediction window + visibility
async function getSettings(req, res) {
  try {
    const r = await db.query(
      'SELECT start_time, end_time, show_register, show_live FROM admin_settings WHERE id = 1'
    );
    const s = r.rows[0] || {};
    res.json({
      window: { start_time: s.start_time || null, end_time: s.end_time || null },
      visibility: {
        show_register: s.show_register !== false,
        show_live: s.show_live !== false,
      },
    });
  } catch (err) {
    console.error('getSettings error:', err.message);
    res.status(500).json({ error: 'Could not read settings.' });
  }
}

// POST /api/admin/visibility   body: { show_register, show_live }
async function setVisibility(req, res) {
  try {
    const { show_register, show_live } = req.body || {};
    const r = await db.query(
      `UPDATE admin_settings
       SET show_register = $1, show_live = $2
       WHERE id = 1
       RETURNING show_register, show_live`,
      [!!show_register, !!show_live]
    );
    res.json({ message: 'Page visibility updated.', visibility: r.rows[0] });
  } catch (err) {
    console.error('setVisibility error:', err.message);
    res.status(500).json({ error: 'Could not update visibility.' });
  }
}

// POST /api/admin/set-time   body: { start_time, end_time }  (ISO strings)
async function setTime(req, res) {
  try {
    const { start_time, end_time } = req.body || {};
    if (!start_time || !end_time) {
      return res.status(400).json({ error: 'Both start_time and end_time are required.' });
    }
    const start = new Date(start_time);
    const end = new Date(end_time);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date format. Use ISO date-time.' });
    }
    if (end <= start) {
      return res.status(400).json({ error: 'End time must be after start time.' });
    }

    const r = await db.query(
      `UPDATE admin_settings
       SET start_time = $1, end_time = $2
       WHERE id = 1
       RETURNING start_time, end_time`,
      [start.toISOString(), end.toISOString()]
    );
    res.json({ message: 'Prediction window updated.', window: r.rows[0] });
  } catch (err) {
    console.error('setTime error:', err.message);
    res.status(500).json({ error: 'Could not update the window.' });
  }
}

// POST /api/admin/eliminate-team   body: { team, eliminated: true|false }
// Marks a team eliminated (or restores it) and cascades the status to its users.
async function eliminateTeam(req, res) {
  const client = await db.pool.connect();
  try {
    const { team } = req.body || {};
    const eliminated = req.body?.eliminated === undefined ? true : !!req.body.eliminated;
    if (!team) {
      return res.status(400).json({ error: 'team is required.' });
    }

    const exists = await client.query('SELECT id FROM teams WHERE name = $1', [team]);
    if (exists.rowCount === 0) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    await client.query('BEGIN');

    if (eliminated) {
      await client.query(
        `UPDATE teams SET is_eliminated = TRUE, eliminated_at = NOW() WHERE name = $1`,
        [team]
      );
      await client.query(
        `UPDATE users SET status = 'eliminated' WHERE team = $1`,
        [team]
      );
    } else {
      // Restore: bring the team and its users back into the contest.
      await client.query(
        `UPDATE teams SET is_eliminated = FALSE, eliminated_at = NULL WHERE name = $1`,
        [team]
      );
      await client.query(
        `UPDATE users SET status = 'active' WHERE team = $1`,
        [team]
      );
    }

    await client.query('COMMIT');

    const affected = await db.query(
      `SELECT COUNT(*)::int AS n FROM users WHERE team = $1`,
      [team]
    );

    res.json({
      message: eliminated
        ? `${team} eliminated. ${affected.rows[0].n} participant(s) knocked out.`
        : `${team} restored. ${affected.rows[0].n} participant(s) back in.`,
      team,
      eliminated,
      affected: affected.rows[0].n,
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('eliminateTeam error:', err.message);
    res.status(500).json({ error: 'Could not update the team.' });
  } finally {
    client.release();
  }
}

// GET /api/admin/users?team=&q=&status=
// Filter by team, search name/section, optional status filter.
async function listUsers(req, res) {
  try {
    const { team, q, status } = req.query;
    const where = [];
    const params = [];

    if (team) {
      params.push(team);
      where.push(`team = $${params.length}`);
    }
    if (status && ['active', 'eliminated'].includes(status)) {
      params.push(status);
      where.push(`status = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(full_name ILIKE $${params.length} OR section ILIKE $${params.length})`);
    }

    const sql =
      `SELECT id, full_name, designation, section, whatsapp, team, status, created_at,
              ip_address, user_agent
       FROM users
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY created_at DESC`;

    const r = await db.query(sql, params);
    res.json({ count: r.rowCount, users: r.rows });
  } catch (err) {
    console.error('listUsers error:', err.message);
    res.status(500).json({ error: 'Could not load participants.' });
  }
}

module.exports = { login, getSettings, setTime, setVisibility, eliminateTeam, listUsers };
