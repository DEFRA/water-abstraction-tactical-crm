require('dotenv').config();

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.pg);

async function run () {
  const {error} = await pool.query('CREATE SCHEMA IF NOT EXISTS crm;');
  console.log(error || 'OK');
  process.exit(error ? 1 : 0);
}

run();
