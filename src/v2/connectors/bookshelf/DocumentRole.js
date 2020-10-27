'use strict';

const { bookshelf } = require('./bookshelf.js');
const Role = require('./Role');
const Document = require('./Document');
const Company = require('./Company');
const Address = require('./Address');
const Contact = require('./Contact');
const InvoiceAccount = require('./InvoiceAccount');

module.exports = bookshelf.model('DocumentRole', {
  tableName: 'document_roles',
  idAttribute: 'document_role_id',
  hasTimestamps: ['date_created', 'date_updated'],

  role () {
    return this.hasOne(Role, 'role_id', 'role_id');
  },

  document () {
    return this.hasOne(Document, 'document_id', 'document_id');
  },

  company () {
    return this.hasOne(Company, 'company_id', 'company_id');
  },

  address () {
    return this.hasOne(Address, 'address_id', 'address_id');
  },

  contact () {
    return this.hasOne(Contact, 'contact_id', 'contact_id');
  },

  invoiceAccount () {
    return this.hasOne(InvoiceAccount, 'invoice_account_id', 'invoice_account_id');
  }
});
