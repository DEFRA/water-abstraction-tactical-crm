require('dotenv').config();
const { pool } = require('../src/lib/connectors/db');

/**
 * Creates schema in postgres DB
 * @param  {String}  schemaName
 * @return {Promise<Boolean>} true if no error
 */
const createSchema = async schemaName => {
  const { error } = await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
  console.log(error || `Create schema ${schemaName}`);
  return !error;
};

async function run () {
  const results = await Promise.all([
    createSchema('crm'),
    createSchema('crm_v2')
  ]);
  process.exit(results.includes(false) ? 1 : 0);
}

run();
