const { bookshelf } = require('./bookshelf.js')

module.exports = bookshelf.model('CompanyAddress', {

  tableName: 'crm_v2.company_addresses',
  idAttribute: 'company_address_id',
  hasTimestamps: ['date_created', 'date_updated'],

  company () {
    return this.belongsTo('Company', 'company_id', 'company_id')
  },

  address () {
    return this.hasOne('Address', 'address_id', 'address_id')
  },

  role () {
    return this.hasOne('Role', 'role_id', 'role_id')
  }
})
