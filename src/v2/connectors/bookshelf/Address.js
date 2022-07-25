const { bookshelf } = require('./bookshelf.js')

module.exports = bookshelf.model('Address', {
  tableName: 'crm_v2.addresses',
  idAttribute: 'address_id',
  hasTimestamps: ['date_created', 'date_updated'],
  companyAddresses () {
    return this.hasMany('CompanyAddress', 'address_id', 'address_id')
  }
})
