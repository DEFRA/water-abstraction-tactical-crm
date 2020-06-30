const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('InvoiceAccountAddress', {
  tableName: 'invoice_account_addresses',
  idAttribute: 'invoice_account_address_id',
  hasTimestamps: ['date_created', 'date_updated'],
  address () {
    return this.hasOne('Address', 'address_id', 'address_id');
  },
  invoiceAccount () {
    return this.belongsTo('InvoiceAccount', 'invoice_account_id', 'invoice_account_id');
  },
  agentCompany () {
    return this.hasOne('Company', 'company_id', 'agent_company_id');
  },
  contact () {
    return this.hasOne('Contact', 'contact_id', 'contact_id');
  }
});
