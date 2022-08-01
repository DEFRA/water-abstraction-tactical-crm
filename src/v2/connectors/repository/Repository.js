const { pool } = require('../../../lib/connectors/db')

class Repository {
  /**
   * Executes a query against the database and returns the first row
   *
   * @param {String} query Parameterised (or not) SQL query to execute
   * @param {Array?} params Optional array of parameters
   */
  async findOne (query, params) {
    const { rows: [row] } = await pool.query(query, params)
    return row
  }

  /**
   * Executes a query against the database and returns all rows
   *
   * @param {String} query Parameterised (or not) SQL query to execute
   * @param {Array?} params Optional array of parameters
   */
  async findMany (query, params) {
    const { rows } = await pool.query(query, params)
    return rows
  }
}

module.exports = Repository
