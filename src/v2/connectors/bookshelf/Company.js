const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('Company', {
  tableName: 'companies',
  idAttribute: 'company_id',
  hasTimestamps: ['date_created', 'date_updated'],
  invoiceAccounts () {
    return this.hasMany('InvoiceAccount', 'company_id', 'company_id');
  }
});
