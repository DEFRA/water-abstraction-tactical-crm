/**
 * Tests that users can view documents depending on their roles within a company
 */
'use strict';
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');
const server = require('../../index');

const { createDocumentHeader, createEntity, deleteEntity, deleteDocumentHeader, createEntityRole, deleteEntityRole } = require('../helpers');
const { getSearchFilter } = require('../../src/controllers/document-headers');

let unclaimedDocumentId;
let claimedDocumentId;
let regimeEntityId;
let companyEntityId;
let individualEntityId;
let entityRoleId;

const createDocumentRequest = (filter = {}) => {
  const filterStr = JSON.stringify(filter);

  const request = {
    method: 'GET',
    url: `/crm/1.0/documentHeader?filter=${encodeURIComponent(filterStr)}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };

  return server.inject(request);
};

lab.experiment('Test document filter', () => {
  lab.before(async() => {
      // Create entities
    {
      const { entity_id: entityId } = await createEntity('regime');
      regimeEntityId = entityId;
    }
    {
      const { entity_id: entityId } = await createEntity('company');
      companyEntityId = entityId;
    }
    {
      const { entity_id: entityId } = await createEntity('individual');
      individualEntityId = entityId;
    }
    {
      const { document_id: documentId } = await createDocumentHeader(regimeEntityId);
      unclaimedDocumentId = documentId;
    }
    {
      const { document_id: documentId } = await createDocumentHeader(regimeEntityId, companyEntityId);
      claimedDocumentId = documentId;
    }
    const entityRole = await createEntityRole(regimeEntityId, companyEntityId, individualEntityId);
    entityRoleId = entityRole.entity_role_id;
  });

  lab.test('The document filter should find document by ID', async () => {
    const filter = {
      document_id: unclaimedDocumentId
    };
    const res = await createDocumentRequest(filter);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.data[0].document_id).to.equal(unclaimedDocumentId);
  });

  lab.test('The document filter should not find document when entity has no role on company', async () => {
    const filter = {
      document_id: unclaimedDocumentId,
      entity_id: individualEntityId
    };

    const res = await createDocumentRequest(filter);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.data.length).to.equal(0);
  });

  lab.test('The document filter should find document when entity has any role on company', async () => {
    const filter = {
      document_id: claimedDocumentId,
      entity_id: individualEntityId
    };

    const res = await createDocumentRequest(filter);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.data[0].document_id).to.equal(claimedDocumentId);
  });

  lab.test('The document filter should find document when entity has specific role on company', async () => {
    const filter = {
      document_id: claimedDocumentId,
      entity_id: individualEntityId,
      roles: ['test_role']
    };

    const res = await createDocumentRequest(filter);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.data[0].document_id).to.equal(claimedDocumentId);
  });

  lab.test('The document filter should not find document when entity does not have specific role on company', async () => {
    const filter = {
      document_id: claimedDocumentId,
      entity_id: individualEntityId,
      roles: ['unknown_role']
    };

    const res = await createDocumentRequest(filter);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.data.length).to.equal(0);
  });

  lab.after(async() => {
    // Delete all temporary entities
    const entityIds = [regimeEntityId, individualEntityId, companyEntityId];
    await Promise.all(entityIds, (entityId) => {
      return deleteEntity(entityId);
    });

    const docIds = [unclaimedDocumentId, claimedDocumentId];
    await Promise.all(docIds, (docId) => {
      return deleteDocumentHeader(docId);
    });

    await deleteEntityRole(individualEntityId, entityRoleId);
  });
});

lab.experiment('getSearchFilter', () => {
  lab.test('It should format a filter object to search by licence number, document name, or licence holder', async() => {
    const result = getSearchFilter('Test');
    Code.expect(result).to.equal([
      {
        system_external_id: {
          $ilike: `%Test%`
        }
      },
      {
        document_name: {
          $ilike: `%Test%`
        }
      },
      {
        'metadata->>Name': {
          $ilike: `%Test%`
        }
      }
    ]);
  });
});
