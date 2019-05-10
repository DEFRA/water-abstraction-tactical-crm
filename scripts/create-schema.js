require('dotenv').config();
const { pool } = require('../src/lib/connectors/db');

async function run () {
  const { error } = await pool.query('CREATE SCHEMA IF NOT EXISTS crm;');
  console.log(error || 'OK');
  process.exit(error ? 1 : 0);
}

run();
