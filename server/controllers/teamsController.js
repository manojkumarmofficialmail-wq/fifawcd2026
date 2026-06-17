const db = require('../db');

// GET /api/teams
// Returns every team with its elimination flag and current prediction count.
async function listTeams(req, res) {
  try {
    const result = await db.query(
      `SELECT t.id,
              t.name,
              t.flag,
              t.is_eliminated,
              t.eliminated_at,
              COUNT(u.id)                                            AS total_count,
              COUNT(u.id) FILTER (WHERE u.status = 'active')         AS active_count
       FROM teams t
       LEFT JOIN users u ON u.team = t.name
       GROUP BY t.id
       ORDER BY t.is_eliminated ASC, active_count DESC, t.name ASC`
    );

    const teams = result.rows.map((r) => ({
      id: r.id,
      name: r.name,
      flag: r.flag,
      is_eliminated: r.is_eliminated,
      eliminated_at: r.eliminated_at,
      total_count: Number(r.total_count),
      active_count: Number(r.active_count),
    }));

    res.json({ teams });
  } catch (err) {
    console.error('listTeams error:', err.message);
    res.status(500).json({ error: 'Could not load teams.' });
  }
}

module.exports = { listTeams };
