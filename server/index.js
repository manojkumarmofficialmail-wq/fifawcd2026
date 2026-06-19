require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// ---- CORS ----
const origins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: origins.includes('*') ? true : origins,
    credentials: false,
  })
);

app.use(express.json());

// ---- Health check ----
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'wc2026-api' }));

// ---- Public visibility + window (used by the header/nav and pages) ----
app.get('/api/visibility', async (req, res) => {
  try {
    const r = await db.query(
      'SELECT start_time, end_time, show_register, show_live FROM admin_settings WHERE id = 1'
    );
    const s = r.rows[0] || {};
    res.json({
      window: { start_time: s.start_time || null, end_time: s.end_time || null },
      show_register: s.show_register !== false,
      show_live: s.show_live !== false,
    });
  } catch (e) {
    res.status(500).json({ error: 'Could not load visibility.' });
  }
});

// ---- API routes ----
app.use('/api/register', require('./routes/register'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/pdf', require('./routes/pdf'));

// ---- Serve the built React client ----
// Serve by default; only skip if SERVE_CLIENT is explicitly "false".
// Try several locations so it works regardless of how the host lays out files.
if (String(process.env.SERVE_CLIENT || 'true').trim().toLowerCase() !== 'false') {
  const candidates = [
    path.join(__dirname, '..', 'client', 'dist'),
    path.join(__dirname, 'client', 'dist'),
    path.join(process.cwd(), 'client', 'dist'),
    path.join(process.cwd(), 'dist'),
  ];
  const clientDist = candidates.find((p) => fs.existsSync(path.join(p, 'index.html')));
  if (clientDist) {
    app.use(express.static(clientDist));
    // SPA fallback for client-side routing (everything except /api)
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(clientDist, 'index.html'));
    });
    console.log('Serving React client from', clientDist);
  } else {
    console.warn('Client build not found. Checked:', candidates.join(' | '));
  }
}

// ---- 404 + error handlers ----
app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint not found.' }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`WC2026 API listening on http://localhost:${PORT}`);
});
