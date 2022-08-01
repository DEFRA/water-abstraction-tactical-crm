'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const invoiceAccountAddressRepo = require('../../../../src/v2/connectors/repository/invoice-account-addresses')
const InvoiceAccountAddress = require('../../../../src/v2/connectors/bookshelf/InvoiceAccountAddress')
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers')

experiment('v2/connectors/repository/invoice-account-addresses', () => {
  beforeEach(async () => {
    sandbox.stub(repoHelpers, 'create').resolves('create-response')
    sandbox.stub(repoHelpers, 'findAll').resolves('find-all-response')
    sandbox.stub(repoHelpers, 'deleteTestData')
    sandbox.stub(repoHelpers, 'deleteOne')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('.create', () => {
    let invoiceAccountAddress, result

    beforeEach(async () => {
      invoiceAccountAddress = { invoiceAccountId: 'test-invoice-account-id', addressId: 'test-address-id', startDate: '2020-04-01' }
      result = await invoiceAccountAddressRepo.create(invoiceAccountAddress)
    })

    test('uses the repository helpers create function', async () => {
      const [model, data] = repoHelpers.create.lastCall.args

      expect(model).to.equal(InvoiceAccountAddress)
      expect(data).to.equal(invoiceAccountAddress)
    })

    test('returns the data from the helper', async () => {
      expect(result).to.equal('create-response')
    })
  })

  experiment('.findAll', () => {
    let invoiceAccountId, result

    beforeEach(async () => {
      invoiceAccountId = 'test-invoice-account-id'
      result = await invoiceAccountAddressRepo.findAll(invoiceAccountId)
    })

    test('uses the repository helpers create function', async () => {
      const [model, idKey, id] = repoHelpers.findAll.lastCall.args

      expect(model).to.equal(InvoiceAccountAddress)
      expect(idKey).to.equal('invoiceAccountId')
      expect(id).to.equal(invoiceAccountId)
    })

    test('returns the data from the helper', async () => {
      expect(result).to.equal('find-all-response')
    })
  })

  experiment('.deleteOne', () => {
    test('uses the repository helpers deleteOne function', async () => {
      await invoiceAccountAddressRepo.deleteOne('test-invoice-account-address-id')

      const [model, idKey, id] = repoHelpers.deleteOne.lastCall.args
      expect(model).to.equal(InvoiceAccountAddress)
      expect(idKey).to.equal('invoiceAccountAddressId')
      expect(id).to.equal('test-invoice-account-address-id')
    })
  })

  experiment('.deleteTestData', () => {
    test('is deleted using the helpers', async () => {
      await invoiceAccountAddressRepo.deleteTestData()

      const [model] = repoHelpers.deleteTestData.lastCall.args
      expect(model).to.equal(InvoiceAccountAddress)
    })
  })
})
