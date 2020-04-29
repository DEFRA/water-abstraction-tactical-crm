'use strict';

const addressesRepo = require('../connectors/repository/addresses');
const companiesRepo = require('../connectors/repository/companies');
const companyAddressesRepo = require('../connectors/repository/company-addresses');
const companyContactsRepo = require('../connectors/repository/company-contacts');
const contactsRepo = require('../connectors/repository/contacts');
const documentsRepo = require('../connectors/repository/documents');
const documentRolesRepo = require('../connectors/repository/document-roles');
const invoiceAccountAddressesRepo = require('../connectors/repository/invoice-account-addresses');
const invoiceAccountsRepo = require('../connectors/repository/invoice-accounts');

/**
 * Calls through to the relevant repositories to delete all test
 * data that may have been created.
 */
const deleteAllTestData = () => {
  return Promise.all([
    documentRolesRepo.deleteTestData(),
    companyAddressesRepo.deleteTestData(),
    invoiceAccountAddressesRepo.deleteTestData(),
    companyContactsRepo.deleteTestData(),
    invoiceAccountsRepo.deleteTestData(),
    companiesRepo.deleteTestData(),
    addressesRepo.deleteTestData(),
    documentsRepo.deleteTestData(),
    contactsRepo.deleteTestData()
  ]);
};

exports.deleteAllTestData = deleteAllTestData;
