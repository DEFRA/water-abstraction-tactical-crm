const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('InvoiceAccountAddress', {
  tableName: 'invoice_account_addresses',
  idAttribute: 'invoice_account_address_id',
  address () {
    return this.hasOne('Address', 'address_id', 'address_id');
  },
  invoiceAccount () {
    return this.belongsTo('InvoiceAccount', 'invoice_account_id', 'invoice_account_id');
  }
});
