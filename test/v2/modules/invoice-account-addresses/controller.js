'use strict';

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const uuid = require('uuid/v4');

const controller = require('../../../../src/v2/modules/invoice-account-addresses/controller');
const invoiceAccountAddressesService = require('../../../../src/v2/services/invoice-account-addresses');
const entityHandlers = require('../../../../src/v2/lib/entity-handlers');

experiment('v2/modules/invoice-accounts/controller', () => {
  let request, h;

  beforeEach(async () => {
    sandbox.stub(entityHandlers, 'createEntity');
    sandbox.stub(entityHandlers, 'deleteEntity');

    sandbox.stub(invoiceAccountAddressesService, 'updateInvoiceAccountAddress');
    h = {};
    request = {
      params: {
        invoiceAccountId: uuid()
      },
      payload: {
        endDate: '2020-01-01'
      }
    };
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.postInvoiceAccountAddress', () => {
    beforeEach(async () => {
      await controller.postInvoiceAccountAddress(request, h);
    });

    test('delegates to the createEntity entity handler', async () => {
      const { args } = entityHandlers.createEntity.lastCall;
      expect(args[0]).to.equal(request);
      expect(args[1]).to.equal(h);
      expect(args[2]).to.equal('invoiceAccountAddress');
      expect(args[3]).to.be.a.function();
    });

    test('the function passed generates the correct path', async () => {
      const [,,, func] = entityHandlers.createEntity.lastCall.args;
      const entity = {
        invoiceAccountAddressId: uuid()
      };
      expect(func(entity)).to.equal(`/crm/2.0/invoice-account-addresses/${entity.invoiceAccountAddressId}`);
    });
  });

  experiment('.deleteInvoiceAccountAddress', () => {
    beforeEach(async () => {
      await controller.deleteInvoiceAccountAddress(request, h);
    });

    test('delegates to the deleteEntity entity handler', async () => {
      expect(entityHandlers.deleteEntity.calledWith(
        request, h, 'invoiceAccountAddress'
      )).to.be.true();
    });
  });

  experiment('.patchInvoiceAccountAddress', () => {
    beforeEach(async () => {
      request.method = 'patch';
      await controller.patchInvoiceAccountAddress(request, h);
    });

    test('calls the underlying service method', async () => {
      expect(invoiceAccountAddressesService.updateInvoiceAccountAddress.calledWith(
        request.params.invoiceAccountAddressId,
        request.payload
      )).to.be.true();
    });
  });
});
