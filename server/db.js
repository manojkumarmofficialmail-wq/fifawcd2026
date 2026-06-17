const { Pool } = require('pg');
require('dotenv').config();

// Build a pool either from DATABASE_URL or from discrete PG* env vars.
const useSsl = String(process.env.PGSSL).toLowerCase() === 'true';

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'fifa_wc2026',
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
