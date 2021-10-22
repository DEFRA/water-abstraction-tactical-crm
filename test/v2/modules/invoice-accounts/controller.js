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
    sandbox.stub(invoiceAccountsService, 'getInvoiceAccountsWithRecentlyUpdatedEntities').resolves([]);
    sandbox.stub(invoiceAccountsService, 'updateInvoiceAccountsWithCustomerFileReference').resolves();
    sandbox.stub(invoiceAccountsService, 'getInvoiceAccountByRef').resolves();
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
  experiment('.getInvoiceAccountsWithRecentlyUpdatedEntities', () => {
    test('calls the invoiceAccountsService', async () => {
      await controller.getInvoiceAccountsWithRecentlyUpdatedEntities();
      expect(invoiceAccountsService.getInvoiceAccountsWithRecentlyUpdatedEntities.called).to.be.true();
    });
  });
  experiment('.getInvoiceAccountByRef', () => {
    test('calls the invoiceAccountsService', async () => {
      await controller.getInvoiceAccountByRef({ query: { ref: 'Y12312301A' } });
      expect(invoiceAccountsService.getInvoiceAccountByRef.called).to.be.true();
    });
  });

  experiment('.updateInvoiceAccountsWithCustomerFileReference', () => {
    test('calls the updateInvoiceAccountsWithCustomerFileReference', async () => {
      await controller.updateInvoiceAccountsWithCustomerFileReference(
        {
          payload: {
            fileReference: 'Some File',
            exportedAt: '2010-10-10',
            exportedCustomers: ['cus1', 'cus2']
          }
        }
      );
      expect(invoiceAccountsService.updateInvoiceAccountsWithCustomerFileReference.called).to.be.true();
    });
  });
});
