'use strict';

const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('Role', {
  tableName: 'roles',
  idAttribute: 'role_id',
  hasTimestamps: ['date_created', 'date_updated']
});
