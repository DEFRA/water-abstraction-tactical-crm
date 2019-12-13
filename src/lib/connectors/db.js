const pg = require('pg');
const moment = require('moment');
const config = require('../../../config');
const { logger } = require('../../logger');

// Output date fields in format YYYY-MM-DD
const DATE_FORMAT = 'YYYY-MM-DD';
pg.types.setTypeParser(pg.types.builtins.DATE, str => moment(str).format(DATE_FORMAT));

const pool = new pg.Pool(config.pg);

pool.on('acquire', () => {
  const { totalCount, idleCount, waitingCount } = pool;
  if (totalCount === config.pg.max && idleCount === 0 && waitingCount > 0) {
    logger.info(`Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`);
  }
});

const query = async (queryString, params) => {
  try {
    const result = await pool.query(queryString, params);
    return { data: result.rows, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

exports.query = query;
exports.pool = pool;
