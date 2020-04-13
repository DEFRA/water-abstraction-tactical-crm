'use strict';

const Hapi = require('@hapi/hapi');
const { cloneDeep } = require('lodash');

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const routes = require('../../../../src/v2/modules/companies/routes');

const createServer = route => {
  const server = Hapi.server();
  const testRoute = cloneDeep(route);
  testRoute.handler = async () => 'ok';

  server.route(testRoute);

  return server;
};

experiment('modules/companies/routes', () => {
  experiment('getCompany', () => {
    let server;

    const getRequest = companyId => ({
      method: 'GET',
      url: `/crm/2.0/companies/${companyId}`
    });

    beforeEach(async () => {
      server = createServer(routes.getCompany);
    });

    test('returns a 400 if the company id is not a uuid', async () => {
      const request = getRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('createCompany', () => {
    let server;

    const getRequest = payload => ({
      method: 'POST',
      url: '/crm/2.0/companies',
      payload
    });

    beforeEach(async () => {
      server = createServer(routes.createCompany);
    });

    experiment('when a person is being created', () => {
      test('isTest can be omitted', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'person'
        });

        const response = await server.inject(request);

        expect(response.payload).to.equal('ok');
        expect(response.statusCode).to.equal(200);
      });

      test('isTest must be boolean', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'person',
          isTest: 'Sure is!'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be supplied', async () => {
        const request = getRequest({
          type: 'person',
          isTest: 'Sure is!'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be a string', async () => {
        const request = getRequest({
          name: 123,
          type: 'person'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('cannot have a company number', async () => {
        const request = getRequest({
          name: 'Name',
          type: 'person',
          companyNumber: '123acb'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });
    });

    experiment('when an organisation is being created', () => {
      test('isTest can be omitted', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'organisation'
        });

        const response = await server.inject(request);

        expect(response.payload).to.equal('ok');
        expect(response.statusCode).to.equal(200);
      });

      test('isTest must be boolean', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'organisation',
          isTest: 'Sure is!'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be supplied', async () => {
        const request = getRequest({
          type: 'organisation'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be a string', async () => {
        const request = getRequest({
          name: 123,
          type: 'organisation'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('can have a company number', async () => {
        const request = getRequest({
          name: 'Cash Inc',
          type: 'organisation',
          companyNumber: '123acb'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(200);
      });

      test('isTest defaults to false', async () => {
        const request = getRequest({
          name: 'Cash Inc',
          type: 'organisation',
          companyNumber: '123acb'
        });

        const response = await server.inject(request);

        expect(response.request.payload.isTest).to.equal(false);
      });
    });
  });
});
