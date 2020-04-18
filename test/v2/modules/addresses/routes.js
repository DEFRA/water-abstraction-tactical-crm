'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const routes = require('../../../../src/v2/modules/addresses/routes');
const { createServerForRoute } = require('../../../helpers');

experiment('modules/addresses/routes', () => {
  experiment('createAddress', () => {
    let fullPayload;
    let server;

    const createAddressRequest = payload => ({
      method: 'POST',
      url: '/crm/2.0/addresses',
      payload
    });

    beforeEach(async () => {
      fullPayload = {
        address1: 'test-address-1',
        address2: 'test-address-2',
        address3: 'test-address-3',
        address4: 'test-address-4',
        town: 'test-town',
        county: 'test-county',
        country: 'test-country',
        postcode: 'test-postcode',
        isTest: true
      };

      server = createServerForRoute(routes.createAddress);
    });

    test('requires address1', async () => {
      delete fullPayload.address1;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('address2 is optional', async () => {
      delete fullPayload.address2;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });

    test('address3 is optional', async () => {
      delete fullPayload.address3;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });

    test('address4 is optional', async () => {
      delete fullPayload.address4;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });

    test('requires town', async () => {
      delete fullPayload.town;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires county', async () => {
      delete fullPayload.county;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires country', async () => {
      delete fullPayload.country;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('postcode is optional (but will be validate in the service layer)', async () => {
      delete fullPayload.postcode;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });

    test('isTest is optional (but will default to false)', async () => {
      delete fullPayload.isTest;
      const response = await server.inject(createAddressRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
      expect(response.request.payload.isTest).to.equal(false);
    });
  });
});
