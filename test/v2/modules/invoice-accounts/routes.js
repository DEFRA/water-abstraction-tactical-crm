'use strict';

const Hapi = require('@hapi/hapi');
const { cloneDeep, omit } = require('lodash');
const uuid = require('uuid/v4');
const qs = require('qs');

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const routes = require('../../../../src/v2/modules/invoice-accounts/routes');

const createServer = route => {
  const server = Hapi.server();
  const testRoute = cloneDeep(route);
  testRoute.handler = async () => 'ok';

  server.route(testRoute);

  return server;
};

experiment('v2/modules/invoice-account/routes', () => {
  experiment('.getInvoiceAccount', () => {
    let server;

    const getRequest = invoiceAccountId => ({
      method: 'GET',
      url: `/crm/2.0/invoice-accounts/${invoiceAccountId}`
    });

    beforeEach(() => {
      server = createServer(routes.getInvoiceAccount);
    });

    test('returns a 400 if the invoice account id is not a guid', async () => {
      const request = getRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('.getInvoiceAccounts', () => {
    let server;

    const getRequest = id => {
      const query = qs.stringify({ id }, { arrayFormat: 'brackets', encode: false });
      return {
        method: 'GET',
        url: `/crm/2.0/invoice-accounts?${query}`
      };
    };

    beforeEach(() => {
      server = createServer(routes.getInvoiceAccounts);
    });

    test('returns a 400 if the query ids are not valid', async () => {
      const request = getRequest([uuid(), 123]);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if the query ids are valid', async () => {
      const request = getRequest([uuid(), uuid()]);
      console.log(request);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 200 if a single value is provided', async () => {
      const request = getRequest(uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });

  experiment('.createInvoiceAccount', () => {
    let server;

    const getRequest = payload => ({
      method: 'POST',
      url: '/crm/2.0/invoice-accounts',
      payload
    });

    beforeEach(() => {
      server = createServer(routes.createInvoiceAccount);
    });

    experiment('returns a 400', () => {
      experiment('if the companyId', async () => {
        test('is omitted', async () => {
          const request = getRequest({
            invoiceAccountNumber: 'A12345678A',
            startDate: '2020-04-01'
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is not a guid', async () => {
          const request = getRequest({
            companyId: '123abc',
            invoiceAccountNumber: 'A12345678A',
            startDate: '2020-04-01'
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if the invoiceAccountNumber', () => {
        test('is omitted', async () => {
          const request = getRequest({
            companyId: uuid(),
            startDate: '2020-04-01',
            endDate: '2020-12-31',
            isTest: true
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is not valid', async () => {
          const request = getRequest({
            companyId: uuid(),
            invoiceAccountNumber: '123abc',
            startDate: '2020-04-01',
            endDate: '2020-12-31',
            isTest: true
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if the startDate', () => {
        test('is omitted', async () => {
          const request = getRequest({
            companyId: uuid(),
            invoiceAccountNumber: 'A12345678A'
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is not valid', async () => {
          const request = getRequest({
            companyId: uuid(),
            invoiceAccountNumber: 'A12345678A',
            startDate: '2020-04-31'
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if the endDate', () => {
        test('is not valid', async () => {
          const request = getRequest({
            companyId: uuid(),
            invoiceAccountNumber: 'A12345678A',
            startDate: '2020-04-01',
            endDate: '2020-12-35'
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is before the startDate', async () => {
          const request = getRequest({
            companyId: uuid(),
            invoiceAccountNumber: 'A12345678A',
            startDate: '2020-04-01',
            endDate: '2020-01-01'
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if isTest', () => {
        test('is not valid', async () => {
          const request = getRequest({
            companyId: uuid(),
            invoiceAccountNumber: 'A12345678A',
            startDate: '2020-04-31',
            isTest: 'yes'
          });

          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });
    });

    experiment('the endDate', () => {
      test('can be set to null', async () => {
        const request = getRequest({
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01',
          endDate: null
        });

        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
      });

      test('defaults to null if not provided', async () => {
        const request = getRequest({
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01'
        });

        const response = await server.inject(request);
        expect(response.request.payload.endDate).to.be.null();
      });

      test('can be set to a valid date', async () => {
        const request = getRequest({
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01',
          endDate: '2020-12-31'
        });

        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
      });
    });

    experiment('isTest', () => {
      test('defaults to false if not provided', async () => {
        const request = getRequest({
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01',
          endDate: '2020-12-31'
        });

        const response = await server.inject(request);
        expect(response.request.payload.isTest).to.be.false();
      });

      test('can be set to a boolean', async () => {
        const request = getRequest({
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01',
          endDate: '2020-12-31',
          isTest: true
        });

        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  experiment('.postInvoiceAccountAddress', () => {
    let server;

    const defaults = {
      addressId: uuid(),
      startDate: '2020-04-01',
      endDate: '2020-12-25',
      agentCompanyId: null,
      contactId: null
    };

    const getRequest = (invoiceAccountId, payload = {}, omitKeys = []) => ({
      method: 'POST',
      url: `/crm/2.0/invoice-accounts/${invoiceAccountId}/addresses`,
      payload: omit({
        ...defaults,
        ...payload
      }, omitKeys)
    });

    beforeEach(() => {
      server = createServer(routes.postInvoiceAccountAddress);
    });

    experiment('returns a 400', () => {
      test('if the invoice account id is not a guid', async () => {
        const request = getRequest(123);
        const response = await server.inject(request);
        expect(response.statusCode).to.equal(400);
      });

      experiment('if the addressId', () => {
        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'addressId');
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is not a guid', async () => {
          const request = getRequest(uuid(), {
            addressId: '123abc'
          });
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if the startDate', () => {
        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'startDate');
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            startDate: '2020-04-31'
          });
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if the endDate', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            endDate: '2020-12-35'
          });
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is before the startDate', async () => {
          const request = getRequest(uuid(), {
            startDate: '2020-04-01',
            endDate: '2020-01-01'
          });
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if isTest', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            isTest: 'yes'
          });
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if agentCompanyId', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            agentCompanyId: 'not-a-guid'
          });
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'agentCompanyId');
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });

      experiment('if contactId', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            contactId: 'not-a-guid'
          });
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });

        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'contactId');
          const response = await server.inject(request);
          expect(response.statusCode).to.equal(400);
        });
      });
    });
    experiment('the endDate', () => {
      test('can be set to null', async () => {
        const request = getRequest(uuid(), {
          endDate: null
        });
        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
      });

      test('defaults to null if not provided', async () => {
        const request = getRequest(uuid(), {}, 'endDate');
        const response = await server.inject(request);
        expect(response.request.payload.endDate).to.be.null();
      });

      test('can be set to a valid date', async () => {
        const request = getRequest(uuid(), {
          endDate: '2020-12-31'
        });
        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
      });
    });

    experiment('isTest', () => {
      test('defaults to false if not provided', async () => {
        const request = getRequest(uuid(), {}, 'isTest');
        const response = await server.inject(request);
        expect(response.request.payload.isTest).to.be.false();
      });

      test('can be set to a boolean', async () => {
        const request = getRequest(uuid(), {
          isTest: true
        });

        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload.isTest).to.be.true();
      });
    });

    experiment('agentCompanyId', () => {
      test('can be set to a guid', async () => {
        const request = getRequest(uuid(), {
          agentCompanyId: uuid()
        });
        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload.agentCompanyId).to.equal(request.payload.agentCompanyId);
      });

      test('can be set to null', async () => {
        const request = getRequest(uuid(), {
          agentCompanyId: null
        });
        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload.agentCompanyId).to.equal(null);
      });
    });

    experiment('contactId', () => {
      test('can be set to a guid', async () => {
        const request = getRequest(uuid(), {
          contactId: uuid()
        });
        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload.contactId).to.equal(request.payload.contactId);
      });

      test('can be set to null', async () => {
        const request = getRequest(uuid(), {
          contactId: null
        });
        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
        expect(response.request.payload.contactId).to.equal(null);
      });
    });
  });
});
