'use strict';

const { v4: uuid } = require('uuid');
const Hapi = require('@hapi/hapi');
const { cloneDeep } = require('lodash');

/**
 * Create a document header for testing purposes
 */
const createDocumentHeader = (regimeEntityId, companyEntityId = null, isCurrent = true) => {
  return {
    method: 'POST',
    url: '/crm/1.0/documentHeader',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      regime_entity_id: regimeEntityId,
      company_entity_id: companyEntityId,
      system_id: 'permit-repo',
      system_internal_id: uuid(),
      system_external_id: uuid(),
      metadata: `{"Name":"TEST LICENCE", "IsCurrent" : ${isCurrent}}`
    }
  };
};

/**
 * Create an entity of the specified type for test
 * purposes
 * @param {String} entityType - individual|company|regime
 * @return {Promise} resolves with entity data
 */
const createEntity = (entityType, overrides) => {
  return {
    method: 'POST',
    url: '/crm/1.0/entity',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: Object.assign({
      entity_nm: `${entityType}@example.com`,
      entity_type: entityType,
      entity_definition: '{}'
    }, overrides)
  };
};

/**
 * Delete entity
 * @param {String} entityGuid - the entity to delete
 */
const deleteEntity = (entityGuid) => {
  return {
    method: 'DELETE',
    url: `/crm/1.0/entity/${entityGuid}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };
};

/**
 * Delete document
 * @param {String} documentId - the document to delete
 */
const deleteDocumentHeader = (documentId) => {
  return {
    method: 'DELETE',
    url: `/crm/1.0/documentHeader/${documentId}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };
};

const createEntityRole = (regimeId, companyEntityId, entityId, role = 'test_role') => {
  const payload = {
    regime_entity_id: regimeId,
    company_entity_id: companyEntityId,
    role
  };
  const request = {
    method: 'POST',
    url: `/crm/1.0/entity/${entityId}/roles`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload
  };
  return request;
};

/**
 * Delete entity role
 * @param {String} documentId - the document to delete
 */
const deleteEntityRole = (entityId, entityRoleId) => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/entity/${entityId}/roles/${entityRoleId}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };
  return request;
};

const createVerification = (entityId, companyEntityId, verificationCode = 'aBcD1') => {
  return {
    method: 'POST',
    url: '/crm/1.0/verification',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      entity_id: entityId,
      company_entity_id: companyEntityId,
      verification_code: verificationCode,
      date_verified: null,
      method: 'post'
    }
  };
};

const deleteVerification = (verificationId) => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/verification/${verificationId}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };

  return request;
};

const createVerificationDocument = (verificationId, documentId) => {
  const request = {
    method: 'POST',
    url: `/crm/1.0/verification/${verificationId}/documents`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      document_id: [documentId]
    }
  };

  return request;
};

const deleteVerificationDocument = verificationId => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/verification/${verificationId}/documents`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };

  return request;
};

/**
 * Creates a HAPI server to allow a single route to be
 * tested. The route handler is replaced with
 * a simple ok 200 response to allow the route definition to
 * be tested.
 *
 * @param {Object} route The HAPI route definition
 */
const createServerForRoute = route => {
  const server = Hapi.server();
  const testRoute = cloneDeep(route);
  testRoute.handler = async () => 'ok';

  server.route(testRoute);

  return server;
};

const parseResponsePayload = res => res.payload && JSON.parse(res.payload);

const makeRequest = async (server, func, ...args) => {
  const request = func(...args);
  const res = await server.inject(request);
  return parseResponsePayload(res).data;
};

exports.createServerForRoute = createServerForRoute;

exports.createVerificationDocument = createVerificationDocument;
exports.deleteVerificationDocument = deleteVerificationDocument;

exports.createVerification = createVerification;
exports.deleteVerification = deleteVerification;

exports.createDocumentHeader = createDocumentHeader;
exports.deleteDocumentHeader = deleteDocumentHeader;

exports.createEntity = createEntity;
exports.deleteEntity = deleteEntity;

exports.createEntityRole = createEntityRole;
exports.deleteEntityRole = deleteEntityRole;

exports.parseResponsePayload = parseResponsePayload;
exports.makeRequest = makeRequest;
