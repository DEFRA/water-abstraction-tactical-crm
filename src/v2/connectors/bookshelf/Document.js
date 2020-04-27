'use strict';

const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('Document', {
  tableName: 'documents',
  idAttribute: 'document_id',
  hasTimestamps: ['date_created', 'date_updated']
});
