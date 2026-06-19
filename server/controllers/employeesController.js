const db = require('../db');

// GET /api/employees  (public)
// Returns the allowlist and the distinct sections for the cascading dropdowns.
async function listEmployees(req, res) {
  try {
    const r = await db.query('SELECT name, section FROM employees ORDER BY section ASC, name ASC');
    const employees = r.rows;
    const sections = [...new Set(employees.map((e) => e.section))].sort((a, b) =>
      a.localeCompare(b)
    );
    res.json({ count: employees.length, sections, employees });
  } catch (err) {
    console.error('listEmployees error:', err.message);
    res.status(500).json({ error: 'Could not load employees.' });
  }
}

// POST /api/admin/employees  (admin)  body: { employees: [{ name, section }] }
// Replaces the entire allowlist with the uploaded rows.
async function replaceEmployees(req, res) {
  const client = await db.pool.connect();
  try {
    const incoming = Array.isArray(req.body?.employees) ? req.body.employees : null;
    if (!incoming) {
      return res.status(400).json({ error: 'Expected an "employees" array.' });
    }

    // Normalise + de-duplicate (case-insensitive on name+section)
    const seen = new Set();
    const rows = [];
    for (const e of incoming) {
      const name = String(e?.name || '').trim();
      const section = String(e?.section || '').trim();
      if (!name || !section) continue;
      const key = (name + '|' + section).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push([name, section]);
    }

    if (rows.length === 0) {
      return res.status(400).json({ error: 'No valid rows found (each needs a name and a section).' });
    }

    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE employees RESTART IDENTITY');

    // Insert in chunks to keep queries small
    const CHUNK = 500;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const slice = rows.slice(i, i + CHUNK);
      const values = [];
      const params = [];
      slice.forEach((row, idx) => {
        params.push(`($${idx * 2 + 1}, $${idx * 2 + 2})`);
        values.push(row[0], row[1]);
      });
      await client.query(
        `INSERT INTO employees (name, section) VALUES ${params.join(', ')}
         ON CONFLICT DO NOTHING`,
        values
      );
    }

    await client.query('COMMIT');

    const countRes = await db.query('SELECT COUNT(*)::int AS n FROM employees');
    res.json({ message: 'Employee list updated.', count: countRes.rows[0].n });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('replaceEmployees error:', err.message);
    res.status(500).json({ error: 'Could not save the employee list.' });
  } finally {
    client.release();
  }
}

module.exports = { listEmployees, replaceEmployees };
