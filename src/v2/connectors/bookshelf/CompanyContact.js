const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('CompanyContact', {
  tableName: 'company_contacts',
  idAttribute: 'company_contact_id',
  hasTimestamps: ['date_created', 'date_updated'],
  company () {
    return this.belongsTo('Company', 'company_id', 'company_id');
  },
  contact () {
    return this.hasOne('Contact', 'contact_id', 'contact_id');
  },
  role () {
    return this.hasOne('Role', 'role_id', 'role_id');
  }
});
