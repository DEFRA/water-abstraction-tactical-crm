'use strict';

const DocumentsRepository = require('./DocumentsRepository');
const DocumentRolesRepository = require('./DocumentRolesRepository');
const ContactsRepository = require('./ContactsRepository');

exports.contacts = new ContactsRepository();
exports.documents = new DocumentsRepository();
exports.documentRoles = new DocumentRolesRepository();
exports.invoiceAccounts = require('./invoice-accounts');
exports.companies = require('./companies');
exports.companyAddresses = require('./company-addresses');
exports.companyContact = require('./company-contacts');
