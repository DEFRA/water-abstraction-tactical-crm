const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('InvoiceAccount', {
  tableName: 'invoice_accounts',
  idAttribute: 'invoice_account_id',
  company () {
    return this.hasOne('Company', 'company_id', 'company_id');
  },
  invoiceAccountAddresses () {
    return this.hasMany('InvoiceAccountAddress', 'invoice_account_id', 'invoice_account_id');
  }
});
