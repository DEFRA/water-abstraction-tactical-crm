'use strict';

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const uuid = require('uuid/v4');

const invoiceAccountsService = require('../../../src/v2/services/invoice-accounts');
const invoiceAccountsRepo = require('../../../src/v2/connectors/repository/invoice-accounts');
const errors = require('../../../src/v2/lib/errors');

const createCompany = () => ({
  companyId: 'comp-id-1',
  name: 'comp-1',
  type: 'organisation',
  companyNumber: '1111',
  externalId: '1111',
  dateCreated: '2019-01-01',
  dateUpdated: '2019-01-01'
});

const createAddress = firstLine => ({
  addressId: 'add-id-1',
  address1: firstLine,
  address2: 'Buttercup meadows',
  address3: null,
  address4: null,
  town: 'Testington',
  county: 'Testingshire',
  country: 'UK'
});

const createInvoiceAccount = id => ({
  invoiceAccountId: id,
  invoiceAccountNumber: 'ia-acc-no-1',
  startDate: '2019-01-01',
  endDate: '2020-01-01',
  dateCreated: '2019-01-01',
  company: createCompany(),
  invoiceAccountAddresses: [{
    startDate: '2019-01-01',
    endDate: '2019-06-01',
    address: createAddress('Buttercup Farm')
  }, {
    startDate: '2019-06-02',
    endDate: null,
    address: createAddress('Daisy Farm')
  }]
});

experiment('v2/services/invoice-accounts', () => {
  beforeEach(() => {
    sandbox.stub(invoiceAccountsRepo, 'create');
    sandbox.stub(invoiceAccountsRepo, 'findOne');
    sandbox.stub(invoiceAccountsRepo, 'findWithCurrentAddress');
  });

  afterEach(() => sandbox.restore());

  experiment('.createInvoiceAccount', () => {
    experiment('when the invoice account data is invalid', () => {
      let invoiceAccount;
      beforeEach(() => {
        invoiceAccount = {
          companyId: 'not-valid',
          invoiceAccountNumber: '123abc',
          startDate: '2020-04-01'
        };
      });
      test('any EntityValidationError is thrown', async () => {
        const err = await expect(invoiceAccountsService.createInvoiceAccount(invoiceAccount))
          .to.reject(errors.EntityValidationError, 'Invoice account not valid');

        expect(err.validationDetails).to.be.an.array();
      });

      test('the contact is not saved', async () => {
        expect(invoiceAccountsRepo.create.called).to.equal(false);
      });
    });

    experiment('when the invoice account data is valid', async () => {
      let result;
      let invoiceAccount;

      beforeEach(async () => {
        invoiceAccount = {
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01'
        };

        invoiceAccountsRepo.create.resolves({
          invoiceAccountId: 'test-id',
          ...invoiceAccount
        });

        result = await invoiceAccountsService.createInvoiceAccount(invoiceAccount);
      });

      test('the invoice account is saved via the repository', async () => {
        expect(invoiceAccountsRepo.create.called).to.equal(true);
      });

      test('the saved invoice account is returned', async () => {
        expect(result.invoiceAccountId).to.equal('test-id');
      });
    });
  });

  experiment('.getInvoiceAccount', () => {
    test('returns the result from the repo', async () => {
      const invoiceAccountId = uuid();
      const invoiceAccount = { invoiceAccountId };
      invoiceAccountsRepo.findOne.resolves(invoiceAccount);

      const result = await invoiceAccountsService.getInvoiceAccount(invoiceAccountId);

      expect(invoiceAccountsRepo.findOne.calledWith(invoiceAccountId)).to.equal(true);
      expect(result).to.equal(invoiceAccount);
    });
  });

  experiment('.getInvoiceAccountsByIds', () => {
    let invoiceAccountIds, repositoryResponse, result;

    beforeEach(async () => {
      invoiceAccountIds = [uuid(), uuid()];
      repositoryResponse = [
        createInvoiceAccount(invoiceAccountIds[0]),
        createInvoiceAccount(invoiceAccountIds[1])
      ];
      invoiceAccountsRepo.findWithCurrentAddress.resolves(repositoryResponse);
      result = await invoiceAccountsService.getInvoiceAccountsByIds(invoiceAccountIds);
    });

    test('has the expected invoice account data', async () => {
      expect(result[0].invoiceAccountId).to.equal(repositoryResponse[0].invoiceAccountId);
      expect(result[1].invoiceAccountId).to.equal(repositoryResponse[1].invoiceAccountId);
    });

    test('includes company data', async () => {
      expect(result[0].company).to.equal(repositoryResponse[0].company);
      expect(result[1].company).to.equal(repositoryResponse[1].company);
    });

    test('includes the current address only', async () => {
      expect(result[0].address).to.equal(repositoryResponse[0].invoiceAccountAddresses[1].address);
      expect(result[1].address).to.equal(repositoryResponse[1].invoiceAccountAddresses[1].address);
    });
  });
});
