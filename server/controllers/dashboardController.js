const db = require('../db');

// GET /api/dashboard
// One call that powers the whole live tracker: totals, team breakdown,
// teams still in / out, the day's eliminations, the prediction window,
// and a champion block when only one team remains.
async function getDashboard(req, res) {
  try {
    const [totals, byTeam, teams, settings, todayOut] = await Promise.all([
      db.query(
        `SELECT COUNT(*)                                       AS total,
                COUNT(*) FILTER (WHERE status = 'active')      AS remaining
         FROM users`
      ),
      db.query(
        `SELECT t.name,
                t.flag,
                t.is_eliminated,
                COUNT(u.id)                                    AS total_count,
                COUNT(u.id) FILTER (WHERE u.status='active')   AS active_count
         FROM teams t
         LEFT JOIN users u ON u.team = t.name
         GROUP BY t.id
         HAVING COUNT(u.id) > 0
         ORDER BY active_count DESC, total_count DESC, t.name ASC`
      ),
      db.query(
        `SELECT name, flag, is_eliminated, eliminated_at FROM teams ORDER BY name ASC`
      ),
      db.query(`SELECT start_time, end_time, show_register, show_live FROM admin_settings WHERE id = 1`),
      db.query(
        `SELECT name, flag, eliminated_at
         FROM teams
         WHERE is_eliminated = TRUE
           AND eliminated_at::date = NOW()::date
         ORDER BY eliminated_at DESC`
      ),
    ]);

    const total = Number(totals.rows[0].total);
    const remaining = Number(totals.rows[0].remaining);

    const teamBreakdown = byTeam.rows.map((r) => ({
      name: r.name,
      flag: r.flag,
      is_eliminated: r.is_eliminated,
      total_count: Number(r.total_count),
      active_count: Number(r.active_count),
    }));

    const teamsIn = teams.rows.filter((t) => !t.is_eliminated);
    const teamsOut = teams.rows.filter((t) => t.is_eliminated);

    // A champion is declared when, among the teams people actually picked,
    // exactly one is still standing and at least one pick has been eliminated.
    // (Teams nobody picked don't block the result.)
    let champion = null;
    const pickedActive = teamBreakdown.filter((t) => !t.is_eliminated && t.active_count > 0);
    if (pickedActive.length === 1 && total - remaining > 0) {
      const championTeam = pickedActive[0];
      const winnersRes = await db.query(
        `SELECT full_name, designation, section, created_at
         FROM users
         WHERE team = $1 AND status = 'active'
         ORDER BY created_at ASC, id ASC`,
        [championTeam.name]
      );
      champion = {
        team: championTeam.name,
        flag: championTeam.flag,
        winners: winnersRes.rows,
      };
    }

    res.json({
      department: {
        committee: 'WCD Staff Welfare Committee',
        directorate: 'Directorate of Women and Child Development Department',
      },
      stats: { total, remaining, eliminated: total - remaining },
      teamBreakdown,
      teamsIn,
      teamsOut,
      eliminatedToday: todayOut.rows,
      window: {
        start_time: (settings.rows[0] || {}).start_time || null,
        end_time: (settings.rows[0] || {}).end_time || null,
      },
      visibility: {
        show_register: (settings.rows[0] || {}).show_register !== false,
        show_live: (settings.rows[0] || {}).show_live !== false,
      },
      champion,
    });
  } catch (err) {
    console.error('getDashboard error:', err.message);
    res.status(500).json({ error: 'Could not load dashboard.' });
  }
}

module.exports = { getDashboard };
