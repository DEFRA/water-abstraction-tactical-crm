'use strict';

const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('Contact', {
  tableName: 'contacts',
  idAttribute: 'contact_id',
  hasTimestamps: ['date_created', 'date_updated']
});
