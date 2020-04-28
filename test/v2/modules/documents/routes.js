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

const { expect } = require('@hapi/code');

const routes = require('../../../../src/v2/modules/documents/routes');
const { createServerForRoute } = require('../../../helpers');

experiment('modules/documents/routes', () => {
  afterEach(async () => {
    sandbox.restore();
  });

  experiment('postDocumentRole', () => {
    let fullPayload;
    let server;
    let documentId;

    const createDocumentRoleRequest = payload => ({
      method: 'POST',
      url: `/crm/2.0/documents/${documentId}/roles`,
      payload
    });

    beforeEach(async () => {
      documentId = uuid();

      fullPayload = {
        role: 'billing',
        isDefault: true,
        startDate: '2020-01-02',
        endDate: '2020-02-02',
        invoiceAccountId: uuid(),
        companyId: uuid(),
        contactId: uuid(),
        addressId: uuid(),
        isTest: true
      };

      sandbox.stub(entityHandler, 'createEntity');
      server = createServerForRoute(routes.postDocumentRole);
    });

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request');
      const toolkit = Symbol('h');

      await routes.postDocumentRole.handler(request, toolkit);

      const createArgs = entityHandler.createEntity.lastCall.args;
      expect(createArgs[0]).to.equal(request);
      expect(createArgs[1]).to.equal(toolkit);
      expect(createArgs[2]).to.equal('documentRole');
    });

    test('the handler uses the locationCallback', async () => {
      const request = Symbol('request');
      const toolkit = Symbol('h');

      await routes.postDocumentRole.handler(request, toolkit);

      const [, , , locationCallback] = entityHandler.createEntity.lastCall.args;

      const documentRole = {
        documentRoleId: uuid()
      };

      const url = locationCallback(documentRole);
      expect(url).to.equal(`/crm/2.0/document-roles/${documentRole.documentRoleId}`);
    });

    test('requires the role', async () => {
      delete fullPayload.role;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('isDefault is optional (but will default to false)', async () => {
      delete fullPayload.isDefault;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
      expect(response.request.payload.isDefault).to.equal(false);
    });

    test('startDate is invalid if not in the format YYYY-MM-DD', async () => {
      fullPayload.startDate = '01/01/2000';
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(400);
    });

    test('startDate is required', async () => {
      delete fullPayload.startDate;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(400);
    });

    test('endDate is optional and will default to null', async () => {
      delete fullPayload.endDate;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
      expect(response.request.payload.endDate).to.equal(null);
    });

    test('invoiceAccountId is optional', async () => {
      delete fullPayload.invoiceAccountId;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
    });

    test('is passed invoiceAccountId should be a uuid', async () => {
      fullPayload.invoiceAccountId = 1234;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(400);
    });

    test('companyId is optional', async () => {
      delete fullPayload.companyId;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
    });

    test('is passed companyId should be a uuid', async () => {
      fullPayload.companyId = 1234;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(400);
    });

    test('contactId is optional', async () => {
      delete fullPayload.contactId;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
    });

    test('is passed contactId should be a uuid', async () => {
      fullPayload.contactId = 1234;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(400);
    });

    test('addressId is optional', async () => {
      delete fullPayload.addressId;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
    });

    test('is passed addressId should be a uuid', async () => {
      fullPayload.addressId = 1234;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(400);
    });

    test('isTest is optional (but will default to false)', async () => {
      delete fullPayload.isTest;
      const response = await server.inject(createDocumentRoleRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
      expect(response.request.payload.isTest).to.equal(false);
    });
  });

  experiment('getDocumentRole', () => {
    let server;

    const createGetDocumentRoleRequest = documentRoleId => ({
      method: 'GET',
      url: `/crm/2.0/document-roles/${documentRoleId}`
    });

    beforeEach(async () => {
      sandbox.stub(entityHandler, 'getEntity');
      server = createServerForRoute(routes.getDocumentRole);
    });

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request');

      await routes.getDocumentRole.handler(request);

      const createArgs = entityHandler.getEntity.lastCall.args;
      expect(createArgs[0]).to.equal(request);
      expect(createArgs[1]).to.equal('documentRole');
    });

    test('returns a 400 if documentRoleId is not a uuid', async () => {
      const request = createGetDocumentRoleRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if documentRoleId is a uuid', async () => {
      const request = createGetDocumentRoleRequest(uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });
});
