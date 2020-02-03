const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('Company', {
  tableName: 'companies',
  idAttribute: 'company_id',
  invoiceAccounts () {
    return this.hasMany('InvoiceAccount', 'company_id', 'company_id');
  }
});
