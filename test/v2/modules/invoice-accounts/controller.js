'use strict';

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const controller = require('../../../../src/v2/modules/invoice-accounts/controller');
const invoiceAccountsService = require('../../../../src/v2/services/invoice-accounts');

const request = {
  query: {
    id: '00000000-0000-0000-0000-000000000000,11111111-0000-0000-0000-000000000000'
  }
};

experiment('v2/modules/invoice-accounts/controller', () => {
  beforeEach(async () => {
    sandbox.stub(invoiceAccountsService, 'getInvoiceAccountsByIds').resolves([]);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getInvoiceAccounts', () => {
    test('passes the query ids to the repository as an array', async () => {
      const request = {
        query: {
          id: [
            '00000000-0000-0000-0000-000000000000',
            '11111111-0000-0000-0000-000000000000'
          ]
        }
      };

      await controller.getInvoiceAccounts(request);
      const [ids] = invoiceAccountsService.getInvoiceAccountsByIds.lastCall.args;
      expect(ids).to.equal([
        '00000000-0000-0000-0000-000000000000',
        '11111111-0000-0000-0000-000000000000'
      ]);
    });

    experiment('when no invoice accounts are found', () => {
      test('an empty array is returned', async () => {
        invoiceAccountsService.getInvoiceAccountsByIds.resolves([]);

        const response = await controller.getInvoiceAccounts(request);

        expect(response).to.equal([]);
      });
    });

    experiment('when invoice accounts are found', () => {
      test('the data is returned', async () => {
        const invoiceAccounts = [
          { invoiceAccountId: '00000000-0000-0000-0000-000000000000' },
          { invoiceAccountId: '00000000-0000-0000-0000-000000000001' }
        ];

        invoiceAccountsService.getInvoiceAccountsByIds.resolves(invoiceAccounts);

        const response = await controller.getInvoiceAccounts(request);

        expect(response).to.equal(invoiceAccounts);
      });
    });
  });
});
