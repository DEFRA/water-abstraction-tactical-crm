'use strict';

const DocumentsRepository = require('./DocumentsRepository');
const DocumentRolesRepository = require('./DocumentRolesRepository');

exports.companies = require('./companies');
exports.companyAddresses = require('./company-addresses');
exports.companyContacts = require('./company-contacts');
exports.documents = new DocumentsRepository();
exports.documentRoles = new DocumentRolesRepository();
exports.invoiceAccounts = require('./invoice-accounts');
