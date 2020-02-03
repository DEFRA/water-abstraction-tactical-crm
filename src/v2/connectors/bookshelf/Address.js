const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('Address', {
  tableName: 'addresses',
  idAttribute: 'address_id'
});
