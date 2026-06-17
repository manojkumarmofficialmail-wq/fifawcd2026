require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

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

// ---- API routes ----
app.use('/api/register', require('./routes/register'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/pdf', require('./routes/pdf'));

// ---- Optionally serve the built React client ----
if (String(process.env.SERVE_CLIENT).toLowerCase() === 'true') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // SPA fallback for client-side routing
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(clientDist, 'index.html'));
    });
    console.log('Serving React client from', clientDist);
  } else {
    console.warn('SERVE_CLIENT=true but client/dist not found. Run the client build first.');
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
