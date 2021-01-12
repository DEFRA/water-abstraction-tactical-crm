'use strict';

const { bookshelf } = require('./bookshelf.js');

module.exports = bookshelf.model('DocumentRole', {
  tableName: 'crm_v2.document_roles',
  idAttribute: 'document_role_id',
  hasTimestamps: ['date_created', 'date_updated'],

  role () {
    return this.hasOne('Role', 'role_id', 'role_id');
  },

  document () {
    return this.hasOne('Document', 'document_id', 'document_id');
  },

  company () {
    return this.hasOne('Company', 'company_id', 'company_id');
  },

  address () {
    return this.hasOne('Address', 'address_id', 'address_id');
  },

  contact () {
    return this.hasOne('Contact', 'contact_id', 'contact_id');
  },

  invoiceAccount () {
    return this.hasOne('InvoiceAccount', 'invoice_account_id', 'invoice_account_id');
  }
});
