const { Pool } = require('pg');
const config = require('../../../config');

const pool = new Pool(config.pg);

function promiseQuery (queryString, params) {
  return new Promise((resolve, reject) => {
    query(queryString, params, (res) => {
      resolve(res);
    });
  });
}

function query (queryString, params, cb) {
  pool.query(queryString, params)
    .then(res => cb({ data: res.rows, error: null }))
    .catch(err => {
      cb({
        error: {
          stack: err.stack,
          code: err.code
        },
        data: null
      });
    });
}

module.exports = {
  query: promiseQuery,
  pool
};
