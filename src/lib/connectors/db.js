'use strict'

const knex = require('./knex')
const { db } = require('@envage/water-abstraction-helpers')

/**
 * Allows a query to be run with same arguments
 * as pg.pool.query(query, params)
 * The query and params are altered to make them
 * compatible with knex.raw
 *
 * @param {String} sqlQuery - bound params are specified as $1, $2 etc.
 * @param {Array} [params] - array params
 * @return {Promise<Object>} query result
 */
const query = (...args) => knex.knex.raw(...db.mapQueryToKnex(...args))

exports.pool = {
  query
}
