const { Pool } = require('pg');
const config = require('../../../config');
const { logger } = require('@envage/water-abstraction-helpers');

const pool = new Pool(config.pg);

pool.on('acquire', () => {
  const { totalCount, idleCount, waitingCount } = pool;
  if (totalCount === config.pg.max && idleCount === 0 && waitingCount > 0) {
    logger.info(`Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`);
  }
});

function promiseQuery (queryString, params) {
  return pool.query(queryString, params);
}

module.exports = {
  query: promiseQuery,
  pool
};
