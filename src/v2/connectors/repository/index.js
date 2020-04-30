'use strict';

const DocumentRolesRepository = require('./DocumentRolesRepository');

exports.documentRoles = new DocumentRolesRepository();

exports.contacts = require('./contacts');
exports.documents = require('./documents');
exports.invoiceAccounts = require('./invoice-accounts');
exports.companies = require('./companies');
exports.companyAddresses = require('./company-addresses');
exports.companyContacts = require('./company-contacts');
exports.invoiceAccounts = require('./invoice-accounts');
