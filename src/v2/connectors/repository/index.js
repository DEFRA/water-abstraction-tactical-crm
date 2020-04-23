'use strict';

const DocumentRolesRepository = require('./DocumentRolesRepository');
const ContactsRepository = require('./ContactsRepository');

exports.contacts = new ContactsRepository();
exports.documents = require('./documents');
exports.documentRoles = new DocumentRolesRepository();
exports.invoiceAccounts = require('./invoice-accounts');
exports.companies = require('./companies');
exports.companyAddresses = require('./company-addresses');
exports.companyContacts = require('./company-contacts');
