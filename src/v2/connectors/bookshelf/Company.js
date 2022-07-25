const { bookshelf } = require('./bookshelf.js')

module.exports = bookshelf.model('Company', {

  tableName: 'crm_v2.companies',

  idAttribute: 'company_id',

  hasTimestamps: ['date_created', 'date_updated'],

  requireFetch: false,

  invoiceAccounts () {
    return this.hasMany('InvoiceAccount', 'company_id', 'company_id')
  },
  companyContact () {
    return this.hasMany('CompanyContact', 'company_id', 'company_id')
  }
})
