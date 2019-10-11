const pg = require('pg');
const moment = require('moment');
const config = require('../../../config');
const { logger } = require('../../logger');
const DATE_FORMAT = 'YYYY-MM-DD';

// Output date fields in format YYYY-MM-DD
pg.types.setTypeParser(1082, str => moment(str).format(DATE_FORMAT));

const pool = new pg.Pool(config.pg);

pool.on('acquire', () => {
  const { totalCount, idleCount, waitingCount } = pool;
  if (totalCount === config.pg.max && idleCount === 0 && waitingCount > 0) {
    logger.info(`Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`);
  }
});

exports.pool = pool;
