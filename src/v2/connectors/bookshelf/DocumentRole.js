'use strict';

const { bookshelf } = require('./bookshelf.js');
const Role = require('./Role');
const Document = require('./Document');

module.exports = bookshelf.model('DocumentRole', {
  tableName: 'document_roles',
  idAttribute: 'document_role_id',
  hasTimestamps: ['date_created', 'date_updated'],

  role () {
    return this.hasOne(Role, 'role_id', 'role_id');
  },

  document () {
    return this.hasOne(Document, 'document_id', 'document_id');
  }
});
