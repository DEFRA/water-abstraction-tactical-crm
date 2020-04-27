
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
  experiment('getDocument', () => {
    let server;

    const createGetDocumentsRequest = documentId => ({
      method: 'GET',
      url: `/crm/2.0/documents/${documentId}`
    });

    beforeEach(async () => {
      sandbox.stub(entityHandler, 'getEntity');
      server = createServerForRoute(routes.getDocument);
    });

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request');

      await routes.getDocument.handler(request);

      const createArgs = entityHandler.getEntity.lastCall.args;
      expect(createArgs[0]).to.equal(request);
      expect(createArgs[1]).to.equal('document');
    });

    test('returns a 400 if documentId is not a uuid', async () => {
      const request = createGetDocumentsRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if documentId is a uuid', async () => {
      const request = createGetDocumentsRequest(uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });

  experiment('.getDocuments', () => {
    test('uses the correct path', async () => {
      expect(routes.getDocuments.path)
        .to.equal('/crm/2.0/documents');
    });
    test('validates the expected query filter parameters', async () => {
      expect(Object.keys(routes.getDocuments.options.validate.query))
        .to.equal(['regime', 'documentType', 'documentRef']);
    });
  });

  experiment('postDocument', () => {
    let fullPayload;
    let server;

    const createDocumentRequest = payload => ({
      method: 'POST',
      url: '/crm/2.0/documents',
      payload
    });

    beforeEach(async () => {
      fullPayload = {
        regime: 'water',
        documentType: 'abstraction_licence',
        versionNumber: 100,
        documentRef: 'doc-ref',
        status: 'current',
        startDate: '2001-01-18',
        endDate: '2010-01-17',
        isTest: true
      };

      sandbox.stub(entityHandler, 'createEntity');
      server = createServerForRoute(routes.postDocument);
    });

    test('includes the expected payload ', async () => {
      expect(Object.keys(routes.postDocument.options.validate.payload))
        .to.equal(['regime', 'documentType', 'versionNumber', 'documentRef', 'status', 'startDate', 'endDate', 'isTest']);
    });

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request');
      const toolkit = Symbol('h');

      await routes.postDocument.handler(request, toolkit);

      const createArgs = entityHandler.createEntity.lastCall.args;
      expect(createArgs[0]).to.equal(request);
      expect(createArgs[1]).to.equal(toolkit);
      expect(createArgs[2]).to.equal('document');
    });

    test('requires regime', async () => {
      delete fullPayload.regime;
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });
    test('requires regime to equal water', async () => {
      fullPayload.regime = 'wrongRegime';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires documentType', async () => {
      delete fullPayload.documentType;
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });
    test('requires documentType to equal abstraction_licence', async () => {
      fullPayload.documentType = 'wrongDocType';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires versionNumber', async () => {
      delete fullPayload.versionNumber;
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires versionNumber to be a number', async () => {
      fullPayload.versionNumber = 'NAN';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires documentRef', async () => {
      delete fullPayload.status;
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires status', async () => {
      delete fullPayload.status;
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires status to be one of current, draft or superseded', async () => {
      fullPayload.status = 'something';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('requires status to be a valid status', async () => {
      fullPayload.status = 'current';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });
    test('requires status to be a valid status', async () => {
      fullPayload.status = 'draft';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });

    test('requires status to be a valid status', async () => {
      fullPayload.status = 'superseded';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(200);
    });

    test('expects the start date to be a valid date', async () => {
      fullPayload.startDate = 'date';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('expects the end date to be a valid date', async () => {
      fullPayload.endDate = 'date';
      const response = await server.inject(createDocumentRequest(fullPayload));
      expect(response.statusCode).to.equal(400);
    });

    test('isTest is optional (but will default to false)', async () => {
      delete fullPayload.isTest;
      const response = await server.inject(createDocumentRequest(fullPayload));

      expect(response.statusCode).to.equal(200);
      expect(response.request.payload.isTest).to.equal(false);
    });
  });
});
