'use strict';

const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('Contact', {
  tableName: 'crm_v2.contacts',
  idAttribute: 'contact_id',
  hasTimestamps: ['date_created', 'date_updated'],

  companyContacts () {
    return this.hasMany('CompanyContact', 'contact_id', 'contact_id');
  }
});
