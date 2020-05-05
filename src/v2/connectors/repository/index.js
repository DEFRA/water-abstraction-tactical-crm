'use strict';

const DocumentRolesRepository = require('./DocumentRolesRepository');
exports.documentRoles = new DocumentRolesRepository();

exports.companies = require('./companies');
exports.companyAddresses = require('./company-addresses');
exports.companyContacts = require('./company-contacts');
exports.invoiceAccounts = require('./invoice-accounts');
exports.invoiceAccountAddresses = require('./invoice-account-addresses');
exports.documents = require('./documents');
