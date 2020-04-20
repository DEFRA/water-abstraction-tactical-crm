const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('CompanyContact', {
  tableName: 'company_contacts',
  idAttribute: 'company_contact_id',
  hasTimestamps: ['date_created', 'date_updated'],
  company () {
    return this.hasOne('Company', 'company_id', 'company_id');
  },
  contact () {
    return this.hasOne('Contact', 'contact_id', 'contact_id');
  },
  roles () {
    return this.hasOne('Roles', 'role_id', 'role_id');
  }
});
