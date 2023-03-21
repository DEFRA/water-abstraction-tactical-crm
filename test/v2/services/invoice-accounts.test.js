'use strict'

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const { v4: uuid } = require('uuid')

const InvoiceAccountNumber = require('../../../src/v2/services/invoice-account-number.js')
const invoiceAccountsService = require('../../../src/v2/services/invoice-accounts')
const invoiceAccountsRepo = require('../../../src/v2/connectors/repository/invoice-accounts')
const invoiceAccountAddressesRepo = require('../../../src/v2/connectors/repository/invoice-account-addresses')
const contactsRepo = require('../../../src/v2/connectors/repository/contacts')
const addressesRepo = require('../../../src/v2/connectors/repository/addresses')

const errors = require('../../../src/v2/lib/errors')

const companyId = 'comp-id-1'

const createCompany = () => ({
  companyId,
  name: 'comp-1',
  type: 'organisation',
  companyNumber: '1111',
  externalId: '1111',
  dateCreated: '2019-01-01',
  dateUpdated: '2019-01-01'
})

const createAddress = firstLine => ({
  addressId: 'add-id-1',
  address1: firstLine,
  address2: 'Buttercup meadows',
  address3: null,
  address4: null,
  town: 'Testington',
  county: 'Testingshire',
  country: 'UK'
})

const createInvoiceAccount = id => ({
  invoiceAccountId: id,
  invoiceAccountNumber: 'ia-acc-no-1',
  startDate: '2019-01-01',
  endDate: '2020-01-01',
  dateCreated: '2019-01-01',
  company: createCompany(),
  companyId,
  invoiceAccountAddresses: [{
    startDate: '2019-01-01',
    endDate: '2019-06-01',
    address: createAddress('Buttercup Farm')
  }, {
    startDate: '2019-06-02',
    endDate: null,
    address: createAddress('Daisy Farm')
  }]
})

experiment('v2/services/invoice-accounts', () => {
  beforeEach(() => {
    sandbox.stub(invoiceAccountsRepo, 'create')
    sandbox.stub(invoiceAccountsRepo, 'findOne')
    sandbox.stub(invoiceAccountsRepo, 'findOneByAccountNumber')
    sandbox.stub(invoiceAccountsRepo, 'findWithCurrentAddress')
    sandbox.stub(invoiceAccountsRepo, 'deleteOne')
    sandbox.stub(invoiceAccountsRepo, 'findAllWhereEntitiesHaveUnmatchingHashes').resolves([])
    sandbox.stub(invoiceAccountAddressesRepo, 'findAll').resolves([{ startDate: '2018-05-03', endDate: '2020-03-31' }])
    sandbox.stub(invoiceAccountAddressesRepo, 'create')
    sandbox.stub(invoiceAccountAddressesRepo, 'deleteOne')
    sandbox.stub(contactsRepo, 'findOneWithCompanies').resolves({
      companyContacts: [{
        companyId
      }]
    })
    sandbox.stub(addressesRepo, 'findOneWithCompanies').resolves({
      companyAddresses: [{
        companyId
      }]
    })
  })

  afterEach(() => sandbox.restore())

  experiment('.createInvoiceAccount', () => {
    experiment('when the invoice account data is invalid', () => {
      let invoiceAccount
      beforeEach(() => {
        invoiceAccount = {
          companyId: 'not-valid',
          invoiceAccountNumber: '123abc',
          startDate: '2020-04-01'
        }
      })
      test('any EntityValidationError is thrown', async () => {
        const err = await expect(invoiceAccountsService.createInvoiceAccount(invoiceAccount))
          .to.reject(errors.EntityValidationError, 'Invoice account not valid')

        expect(err.validationDetails).to.be.an.array()
      })

      test('the invoice account is not saved', async () => {
        expect(invoiceAccountsRepo.create.called).to.equal(false)
      })
    })

    experiment('when an invoice account number is supplied and the invoice account data is valid', () => {
      let result
      let invoiceAccount

      beforeEach(async () => {
        invoiceAccount = {
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01'
        }

        invoiceAccountsRepo.create.resolves({
          invoiceAccountId: 'test-id',
          ...invoiceAccount
        })
      })

      experiment('when there are no DB conflicts', () => {
        beforeEach(async () => {
          result = await invoiceAccountsService.createInvoiceAccount(invoiceAccount)
        })

        test('the invoice account is saved via the repository', async () => {
          expect(invoiceAccountsRepo.create.called).to.equal(true)
        })

        test('the saved invoice account is returned', async () => {
          expect(result.invoiceAccountId).to.equal('test-id')
        })
      })

      experiment('when there is a Postgres unique violation', () => {
        beforeEach(async () => {
          const err = new Error()
          err.code = '23505'
          invoiceAccountsRepo.create.rejects(err)
        })

        test('rejects with a UniqueConstraintViolation error', async () => {
          const func = () => invoiceAccountsService.createInvoiceAccount(invoiceAccount)
          const err = await expect(func()).to.reject()
          expect(err instanceof errors.UniqueConstraintViolation).to.be.true()
        })
      })

      experiment('when there is any other error', () => {
        let error

        beforeEach(async () => {
          error = new Error()
          error.code = '1234'
          invoiceAccountsRepo.create.rejects(error)
        })

        test('rejects with a ConflictingData error', async () => {
          const func = () => invoiceAccountsService.createInvoiceAccount(invoiceAccount)
          const err = await expect(func()).to.reject()
          expect(err).to.equal(error)
        })
      })
    })

    experiment('when a valid region code is supplied', () => {
      let result
      let invoiceAccount

      beforeEach(async () => {
        invoiceAccount = {
          companyId: uuid(),
          regionCode: 'A',
          startDate: '2020-04-01'
        }

        invoiceAccountsRepo.create.resolves({
          invoiceAccountId: 'test-id',
          ...invoiceAccount
        })
      })

      experiment('when invoice accounts exist in this region', () => {
        beforeEach(async () => {
          sandbox.stub(InvoiceAccountNumber, 'generate').resolves('A12345678A')

          result = await invoiceAccountsService.createInvoiceAccount(invoiceAccount)
        })

        test('the invoice account number generate() method is called with the region code', async () => {
          expect(InvoiceAccountNumber.generate.calledWith('A')).to.be.true()
        })

        test('the invoice account number used is the next one available', async () => {
          const { invoiceAccountNumber } = invoiceAccountsRepo.create.lastCall.args[0]
          expect(invoiceAccountNumber).to.equal('A12345678A')
        })

        test('the invoice account is saved via the repository', async () => {
          expect(invoiceAccountsRepo.create.called).to.equal(true)
        })

        test('the saved invoice account is returned', async () => {
          expect(result.invoiceAccountId).to.equal('test-id')
        })
      })

      experiment('when there are no existing invoice accounts in this region', () => {
        beforeEach(async () => {
          sandbox.stub(InvoiceAccountNumber, 'generate').resolves('A00000001A')

          await invoiceAccountsService.createInvoiceAccount(invoiceAccount)
        })

        test('the invoice account number used is the first one', async () => {
          const { invoiceAccountNumber } = invoiceAccountsRepo.create.lastCall.args[0]
          expect(invoiceAccountNumber).to.equal('A00000001A')
        })
      })
    })
  })

  experiment('.getInvoiceAccount', () => {
    test('returns the result from the repo', async () => {
      const invoiceAccountId = uuid()
      const invoiceAccount = { invoiceAccountId }
      invoiceAccountsRepo.findOne.resolves(invoiceAccount)

      const result = await invoiceAccountsService.getInvoiceAccount(invoiceAccountId)

      expect(invoiceAccountsRepo.findOne.calledWith(invoiceAccountId)).to.equal(true)
      expect(result).to.equal(invoiceAccount)
    })
  })

  experiment('.getInvoiceAccountByRef', () => {
    test('returns the result from the repo', async () => {
      const invoiceAccountId = uuid()
      const invoiceAccount = { invoiceAccountId }
      invoiceAccountsRepo.findOneByAccountNumber.resolves(invoiceAccount)

      const result = await invoiceAccountsService.getInvoiceAccountByRef('Y12312301A')

      expect(invoiceAccountsRepo.findOneByAccountNumber.calledWith('Y12312301A')).to.equal(true)
      expect(result).to.equal(invoiceAccount)
    })
  })

  experiment('.getInvoiceAccountsByIds', () => {
    let invoiceAccountIds, repositoryResponse, result

    beforeEach(async () => {
      invoiceAccountIds = [uuid(), uuid()]
      repositoryResponse = [
        createInvoiceAccount(invoiceAccountIds[0]),
        createInvoiceAccount(invoiceAccountIds[1])
      ]
      invoiceAccountsRepo.findWithCurrentAddress.resolves(repositoryResponse)
      result = await invoiceAccountsService.getInvoiceAccountsByIds(invoiceAccountIds)
    })

    test('has the expected invoice account data', async () => {
      expect(result[0].invoiceAccountId).to.equal(repositoryResponse[0].invoiceAccountId)
      expect(result[1].invoiceAccountId).to.equal(repositoryResponse[1].invoiceAccountId)
    })

    test('includes company data', async () => {
      expect(result[0].company).to.equal(repositoryResponse[0].company)
      expect(result[1].company).to.equal(repositoryResponse[1].company)
    })

    test('includes the most recent address only', async () => {
      expect(result[0].invoiceAccountAddresses.length).to.equal(1)
      expect(result[0].invoiceAccountAddresses[0].startDate).to.equal('2019-06-02')
      expect(result[0].invoiceAccountAddresses[0].address).to.equal(repositoryResponse[0].invoiceAccountAddresses[1].address)
      expect(result[1].invoiceAccountAddresses.length).to.equal(1)
      expect(result[1].invoiceAccountAddresses[0].startDate).to.equal('2019-06-02')
      expect(result[1].invoiceAccountAddresses[0].address).to.equal(repositoryResponse[1].invoiceAccountAddresses[1].address)
    })
  })

  experiment('.deleteInvoiceAccount', () => {
    test('calls the deleteOne repo method', async () => {
      await invoiceAccountsService.deleteInvoiceAccount('test-invoice-account-id')
      expect(invoiceAccountsRepo.deleteOne.calledWith('test-invoice-account-id')).to.be.true()
    })
  })

  experiment('.getInvoiceAccountsWithRecentlyUpdatedEntities', () => {
    test('calls the findAllWhereEntitiesHaveUnmatchingHashes repo method', async () => {
      await invoiceAccountsService.getInvoiceAccountsWithRecentlyUpdatedEntities()
      expect(invoiceAccountsRepo.findAllWhereEntitiesHaveUnmatchingHashes.called).to.be.true()
    })
  })
})
