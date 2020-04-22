'use strict';

const DocumentsRepository = require('./DocumentsRepository');
const DocumentRolesRepository = require('./DocumentRolesRepository');

exports.documents = new DocumentsRepository();
exports.documentRoles = new DocumentRolesRepository();
exports.invoiceAccounts = require('./invoice-accounts');
exports.companies = require('./companies');
exports.companyAddresses = require('./company-addresses');
exports.companyContacts = require('./company-contacts');
