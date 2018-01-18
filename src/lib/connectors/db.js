
const { Pool } = require('pg')

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

function promiseQuery (queryString, params) {
  return queryAsPromise = new Promise((resolve, reject) => {
    query(queryString, params, (res) => {
      resolve(res)
    })
  })
}

function query (queryString, params, cb) {
  pool.query(queryString, params)
    .then((res) => {
      cb({data: res.rows, error: null})
    })
    .catch(err => {
      cb({error: { stack : err.stack, code : err.code}, data: null})
    })
}

module.exports = {
  query: promiseQuery,
  pool
}
