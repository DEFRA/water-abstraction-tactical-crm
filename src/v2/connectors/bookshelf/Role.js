'use strict'

const { bookshelf } = require('./bookshelf.js')

module.exports = bookshelf.model('Role', {
  tableName: 'crm_v2.roles',
  idAttribute: 'role_id',
  hasTimestamps: ['date_created', 'date_updated']
})
