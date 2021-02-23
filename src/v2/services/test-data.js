'use strict';

const addressesRepo = require('../connectors/repository/addresses');
const { pool } = require('../../lib/connectors/db');
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
const deleteAllTestData = async () => {
  await documentRolesRepo.deleteTestData();
  await companyAddressesRepo.deleteTestData();
  await pool.query('delete from crm.entity where entity_nm LIKE \'acceptance-test.%\' or entity_nm like \'%@example.com\' or entity_nm like \'regression.tests.%\'');
  await invoiceAccountAddressesRepo.deleteTestData();
  await companyContactsRepo.deleteTestData();
  await invoiceAccountsRepo.deleteTestData();
  await companiesRepo.deleteTestData();
  await addressesRepo.deleteTestData();
  await documentsRepo.deleteTestData();
  await contactsRepo.deleteTestData();
};

exports.deleteAllTestData = deleteAllTestData;
