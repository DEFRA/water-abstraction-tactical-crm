const { bookshelf } = require('../../bookshelf')

const camelCaseKeys = require('../../../../lib/camel-case-keys')

const multiRow = async (query, params) => {
  const { rows } = await bookshelf.knex.raw(query, params)
  const data = camelCaseKeys(rows)
  return data
}

const singleRow = async (query, params) => {
  const result = await multiRow(query, params)
  return result.length ? result[0] : null
}

const deleteRows = (query, params) => {
  return bookshelf.knex.raw(query, params)
}

exports.deleteRows = deleteRows
exports.multiRow = multiRow
exports.singleRow = singleRow
