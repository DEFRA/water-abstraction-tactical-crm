'use strict';

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const controller = require('../../../../src/v2/modules/invoice-accounts/controller');
const repos = require('../../../../src/v2/connectors/repository');

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

experiment('v2/modules/invoice-accounts/controller', () => {
  let repositoryResponse;

  beforeEach(async () => {
    repositoryResponse = [
      createInvoiceAccount('ia-1'),
      createInvoiceAccount('ia-2')
    ];

    sandbox.stub(repos.invoiceAccounts, 'findOne').resolves(repositoryResponse[0]);
    sandbox.stub(repos.invoiceAccounts, 'findWithCurrentAddress').resolves(repositoryResponse);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getInvoiceAccounts', () => {
    let request;
    let response;

    beforeEach(async () => {
      request = {
        query: {
          id: ['ia-1', 'ia-2']
        }
      };
      response = await controller.getInvoiceAccounts(request);
    });

    test('calls repository method with correct arguments', async () => {
      expect(repos.invoiceAccounts.findWithCurrentAddress.calledWith(
        ['ia-1', 'ia-2']
      )).to.be.true();
    });

    test('resolves with a response that is camel cased', async () => {
      expect(response[0].invoiceAccountId).to.equal('ia-1');
    });

    test('has the expected invoice account data', async () => {
      expect(response[0].invoiceAccountId).to.equal(repositoryResponse[0].invoiceAccountId);
      expect(response[1].invoiceAccountId).to.equal(repositoryResponse[1].invoiceAccountId);
    });

    test('includes company data', async () => {
      expect(response[0].company).to.equal(repositoryResponse[0].company);
      expect(response[1].company).to.equal(repositoryResponse[1].company);
    });

    test('includes the current address only', async () => {
      expect(response[0].address).to.equal(repositoryResponse[0].invoiceAccountAddresses[1].address);
      expect(response[1].address).to.equal(repositoryResponse[1].invoiceAccountAddresses[1].address);
    });
  });

  experiment('.getInvoiceAccount', () => {
    let request;
    let response;

    beforeEach(async () => {
      request = {
        params: {
          invoiceAccountId: 'ia-1'
        }
      };
      response = await controller.getInvoiceAccount(request);
    });

    test('calls repository method with correct arguments', async () => {
      expect(repos.invoiceAccounts.findOne.calledWith('ia-1')).to.be.true();
    });

    test('has the expected invoice account data', async () => {
      expect(response).to.be.an.object();
      expect(response).to.equal(repositoryResponse[0]);
    });
  });
});
