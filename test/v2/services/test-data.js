'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const addressesRepo = require('../../../src/v2/connectors/repository/addresses')
const companiesRepo = require('../../../src/v2/connectors/repository/companies')
const companyAddressesRepo = require('../../../src/v2/connectors/repository/company-addresses')
const companyContactsRepo = require('../../../src/v2/connectors/repository/company-contacts')
const contactsRepo = require('../../../src/v2/connectors/repository/contacts')
const documentsRepo = require('../../../src/v2/connectors/repository/documents')
const documentRolesRepo = require('../../../src/v2/connectors/repository/document-roles')
const invoiceAccountAddressesRepo = require('../../../src/v2/connectors/repository/invoice-account-addresses')
const invoiceAccountsRepo = require('../../../src/v2/connectors/repository/invoice-accounts')

const testDataService = require('../../../src/v2/services/test-data')

experiment('services/contacts', () => {
  beforeEach(async () => {
    sandbox.stub(addressesRepo, 'deleteTestData').resolves()
    sandbox.stub(companiesRepo, 'deleteTestData').resolves()
    sandbox.stub(companyAddressesRepo, 'deleteTestData').resolves()
    sandbox.stub(companyContactsRepo, 'deleteTestData').resolves()
    sandbox.stub(contactsRepo, 'deleteTestData').resolves()
    sandbox.stub(documentsRepo, 'deleteTestData').resolves()
    sandbox.stub(documentRolesRepo, 'deleteTestData').resolves()
    sandbox.stub(invoiceAccountAddressesRepo, 'deleteTestData').resolves()
    sandbox.stub(invoiceAccountsRepo, 'deleteTestData').resolves()
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('.deleteAllTestData', () => {
    beforeEach(async () => {
      await testDataService.deleteAllTestData()
    })

    test('deletes the document roles', async () => {
      expect(documentRolesRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the company addresses', async () => {
      expect(companyAddressesRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the invoice account addresses', async () => {
      expect(invoiceAccountAddressesRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the company contacts', async () => {
      expect(companyContactsRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the invoice accounts', async () => {
      expect(invoiceAccountsRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the companies', async () => {
      expect(companiesRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the addresses', async () => {
      expect(addressesRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the documents', async () => {
      expect(documentsRepo.deleteTestData.called).to.equal(true)
    })

    test('deletes the contacts', async () => {
      expect(contactsRepo.deleteTestData.called).to.equal(true)
    })
  })
})
