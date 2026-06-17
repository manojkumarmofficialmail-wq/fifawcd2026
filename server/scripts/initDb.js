// Runs database/schema.sql then database/seed.sql against the configured DB.
// Usage:  npm run init-db
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../db');

async function run() {
  const dbDir = path.join(__dirname, '..', '..', 'database');
  const schema = fs.readFileSync(path.join(dbDir, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(dbDir, 'seed.sql'), 'utf8');

  console.log('Applying schema...');
  await db.query(schema);
  console.log('Applying seed data...');
  await db.query(seed);
  console.log('Database initialised successfully.');
  await db.pool.end();
}

run().catch((err) => {
  console.error('init-db failed:', err.message);
  process.exit(1);
});
