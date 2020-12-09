'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const sandbox = require('sinon').createSandbox();
const uuid = require('uuid/v4');

const entityHandler = require('../../../../src/v2/lib/entity-handlers');
const controller = require('../../../../src/v2/modules/addresses/controller');

const { expect } = require('@hapi/code');

const routes = require('../../../../src/v2/modules/addresses/routes');
const { createServerForRoute } = require('../../../helpers');

experiment('modules/addresses/routes', () => {
  afterEach(async () => {
    sandbox.restore();
  });

  experiment('postAddress', () => {
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
        isTest: true,
        dataSource: 'nald',
        uprn: 123456
      };

      server = createServerForRoute(routes.postAddress);
    });

    test('the correct handler is specified', async () => {
      expect(routes.postAddress.handler)
        .to.equal(controller.postAddress);
    });

    test('address1 is optional', async () => {
      delete fullPayload.address1;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
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

    test('town is optional', async () => {
      delete fullPayload.town;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });

    test('county is optional', async () => {
      delete fullPayload.county;
      const response = await server.inject(createAddressRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
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

    test('dataSource is optional (but will default to "wrls")', async () => {
      delete fullPayload.dataSource;
      const response = await server.inject(createAddressRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
      expect(response.request.payload.dataSource).to.equal('wrls');
    });

    test('uprn is optional (will default to null)', async () => {
      delete fullPayload.uprn;
      const response = await server.inject(createAddressRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
      expect(response.request.payload.uprn).to.equal(null);
    });
  });

  experiment('getAddress', () => {
    let server;

    const createGetAddressRequest = addressId => ({
      method: 'GET',
      url: `/crm/2.0/addresses/${addressId}`
    });

    beforeEach(async () => {
      sandbox.stub(entityHandler, 'getEntity');
      server = createServerForRoute(routes.getAddress);
    });

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request');

      await routes.getAddress.handler(request);

      const createArgs = entityHandler.getEntity.lastCall.args;
      expect(createArgs[0]).to.equal(request);
      expect(createArgs[1]).to.equal('address');
    });

    test('returns a 400 if addressId is not a uuid', async () => {
      const request = createGetAddressRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if addressId is a uuid', async () => {
      const request = createGetAddressRequest(uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });

  experiment('deleteAddress', () => {
    let server;

    const createDeleteAddressRequest = addressId => ({
      method: 'DELETE',
      url: `/crm/2.0/addresses/${addressId}`
    });

    beforeEach(async () => {
      sandbox.stub(entityHandler, 'deleteEntity');
      server = createServerForRoute(routes.deleteAddress);
    });

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request');
      const toolkit = Symbol('h');

      await routes.deleteAddress.handler(request, toolkit);

      const createArgs = entityHandler.deleteEntity.lastCall.args;
      expect(createArgs[0]).to.equal(request);
      expect(createArgs[1]).to.equal(toolkit);
      expect(createArgs[2]).to.equal('address');
    });

    test('returns a 400 if addressId is not a uuid', async () => {
      const request = createDeleteAddressRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if addressId is a uuid', async () => {
      const request = createDeleteAddressRequest(uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });
});
