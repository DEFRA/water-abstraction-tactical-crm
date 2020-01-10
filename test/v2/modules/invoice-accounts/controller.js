'use strict';

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const controller = require('../../../../src/v2/modules/invoice-accounts/controller');
const repos = require('../../../../src/v2/connectors/repository');

experiment('v2/modules/invoice-accounts/controller', () => {
  let repositoryResponse;

  beforeEach(async () => {
    repositoryResponse = [
      {
        'invoice_account.invoice_account_id': 'ia-1',
        'invoice_account.invoice_account_number': 'ia-acc-no-1',
        'invoice_account.start_date': '2019-01-01',
        'invoice_account.end_date': '2020-01-01',
        'invoice_account.date_created': '2019-01-01',
        'company.company_id': 'comp-id-1',
        'company.name': 'comp-1',
        'company.type': 'organisation',
        'company.company_number': '1111',
        'company.external_id': '1111',
        'company.date_created': '2019-01-01',
        'company.date_updated': '2019-01-01'
      },
      {
        'invoice_account.invoice_account_id': 'ia-2',
        'invoice_account.invoice_account_number': 'ia-acc-no-2',
        'invoice_account.start_date': '2019-02-02',
        'invoice_account.end_date': '2020-02-02',
        'invoice_account.date_created': '2019-02-02',
        'company.company_id': 'comp-id-2',
        'company.name': 'comp-2',
        'company.type': 'organisation',
        'company.company_number': '2222',
        'company.external_id': '2222',
        'company.date_created': '2019-02-02',
        'company.date_updated': '2019-02-02'
      }
    ];

    sandbox.stub(repos.invoiceAccounts, 'findManyByIds').resolves(repositoryResponse);
    sandbox.stub(repos.invoiceAccounts, 'findOneById').resolves(repositoryResponse[0]);
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
      expect(repos.invoiceAccounts.findManyByIds.calledWith(
        ['ia-1', 'ia-2']
      )).to.be.true();
    });

    test('resolves with a response that is camel cased', async () => {
      expect(response[0].invoiceAccountId).to.equal('ia-1');
    });

    test('has the expected invoice account data', async () => {
      const invoiceAccount = response[0];
      expect(invoiceAccount.invoiceAccountId).to.equal(repositoryResponse[0]['invoice_account.invoice_account_id']);
      expect(invoiceAccount.invoiceAccountNumber).to.equal(repositoryResponse[0]['invoice_account.invoice_account_number']);
      expect(invoiceAccount.startDate).to.equal(repositoryResponse[0]['invoice_account.start_date']);
      expect(invoiceAccount.endDate).to.equal(repositoryResponse[0]['invoice_account.end_date']);
      expect(invoiceAccount.dateCreated).to.equal(repositoryResponse[0]['invoice_account.date_created']);
      expect(invoiceAccount.dateUpdated).to.equal(repositoryResponse[0]['invoice_account.date_updated']);
    });

    test('incluces the company as a nested object', async () => {
      const company = response[0].company;

      expect(company.companyId).to.equal(repositoryResponse[0]['company.company_id']);
      expect(company.name).to.equal(repositoryResponse[0]['company.name']);
      expect(company.type).to.equal(repositoryResponse[0]['company.type']);
      expect(company.companyNumber).to.equal(repositoryResponse[0]['company.company_number']);
      expect(company.externalId).to.equal(repositoryResponse[0]['company.external_id']);
      expect(company.dateCreated).to.equal(repositoryResponse[0]['company.date_created']);
      expect(company.dateUpdated).to.equal(repositoryResponse[0]['company.date_updated']);
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
      expect(repos.invoiceAccounts.findOneById.calledWith('ia-1')).to.be.true();
    });

    test('has the expected invoice account data', async () => {
      const invoiceAccount = response;
      expect(invoiceAccount.invoiceAccountId).to.equal(repositoryResponse[0]['invoice_account.invoice_account_id']);
      expect(invoiceAccount.invoiceAccountNumber).to.equal(repositoryResponse[0]['invoice_account.invoice_account_number']);
      expect(invoiceAccount.startDate).to.equal(repositoryResponse[0]['invoice_account.start_date']);
      expect(invoiceAccount.endDate).to.equal(repositoryResponse[0]['invoice_account.end_date']);
      expect(invoiceAccount.dateCreated).to.equal(repositoryResponse[0]['invoice_account.date_created']);
      expect(invoiceAccount.dateUpdated).to.equal(repositoryResponse[0]['invoice_account.date_updated']);
    });

    test('incluces the company as a nested object', async () => {
      const company = response.company;

      expect(company.companyId).to.equal(repositoryResponse[0]['company.company_id']);
      expect(company.name).to.equal(repositoryResponse[0]['company.name']);
      expect(company.type).to.equal(repositoryResponse[0]['company.type']);
      expect(company.companyNumber).to.equal(repositoryResponse[0]['company.company_number']);
      expect(company.externalId).to.equal(repositoryResponse[0]['company.external_id']);
      expect(company.dateCreated).to.equal(repositoryResponse[0]['company.date_created']);
      expect(company.dateUpdated).to.equal(repositoryResponse[0]['company.date_updated']);
    });
  });
});
