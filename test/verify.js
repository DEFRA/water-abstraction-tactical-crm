/**
 * Test verification process
 * - Create entity
 * - Create company
 * - Create unverified document headers linked to entity/company
 * - Create verification code - update documents with ID
 * - Verify with auth code
 * - Update documents with verification ID to verified status
 */
'use strict';
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const moment = require('moment');

const Code = require('code');
const server = require('../index');

console.log(`Node version ${process.version}`);

let regimeEntityId = null;
let individualEntityId = null;
let companyEntityId = null;
let documentHeaderId = null;
let verificationId = null;
let verificationCode = null;

/**
 * Create a document header for testing purposes
 */
const createDocumentHeader = async (regimeEntityId) => {
  const request = {
    method: 'POST',
    url: '/crm/1.0/documentHeader',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      regime_entity_id: regimeEntityId,
      system_id: 'permit-repo',
      system_internal_id: '9999999999',
      system_external_id: 'xx/xx/xx/xxxx',
      metadata: '{"Name":"TEST LICENCE"}'
    }
  };
  const res = await server.inject(request);
  const {error, data} = JSON.parse(res.payload);

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

/**
 * Create an entity of the specified type for test
 * purposes
 * @param {String} entityType - individual|company|regime
 * @return {Promise} resolves with entity data
 */
const createEntity = async (entityType) => {
  console.log(`Creating entity ${entityType}`);
  const request = {
    method: 'POST',
    url: '/crm/1.0/entity',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      entity_nm: `${entityType}@example.com`,
      entity_type: entityType,
      entity_definition: '{}'
    }
  };
  const res = await server.inject(request);
  const {error, data} = JSON.parse(res.payload);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

/**
 * Delete entity
 * @param {String} entityGuid - the entity to delete
 */
const deleteEntity = async(entityGuid) => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/entity/${entityGuid}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };
  const res = await server.inject(request);
  return res;
};

/**
 * Delete document
 * @param {String} documentId - the document to delete
 */
const deleteDocumentHeader = async(documentId) => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/documentHeader/${documentId}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };
  const res = await server.inject(request);
  return res;
};

lab.experiment('Check verification', () => {
  // Create regime
  lab.before(async() => {
    const { entity_id: entityId } = await createEntity('regime');
    regimeEntityId = entityId;
  });

  // Create company
  lab.before(async() => {
    const { entity_id: entityId } = await createEntity('company');
    companyEntityId = entityId;
  });

  // Create individual
  lab.before(async() => {
    const { entity_id: entityId } = await createEntity('individual');
    individualEntityId = entityId;
  });

  // Create doc
  lab.before(async() => {
    const { document_id: documentId } = await createDocumentHeader(regimeEntityId);
    documentHeaderId = documentId;
  });

  lab.after(async() => {
    // Delete all temporary entities
    const entityIds = [regimeEntityId, individualEntityId, companyEntityId];
    await Promise.all(entityIds, (entityId) => {
      return deleteEntity(entityId);
    });
  });

  lab.after(async() => {
    // Delete all temporary docs
    await deleteDocumentHeader(documentHeaderId);
  });

  // * @param {String} request.payload.entity_id - the GUID of the current individual's entity
  // * @param {String} request.payload.company_entity_id - the GUID of the current individual's company
  // * @param {String} request.payload.method - the verification method - post|phone
  // * @param {Object} h - the HAPI response toolkit
  lab.test('The API should create a verification code', async () => {
    console.log('The API should create a verification code');

    const request = {
      method: 'POST',
      url: `/crm/1.0/verification`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        entity_id: individualEntityId,
        company_entity_id: companyEntityId,
        method: 'post'
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(201);

    // Check payload
    const payload = JSON.parse(res.payload);

    Code.expect(payload.error).to.equal(null);
    Code.expect(payload.data.verification_id).to.have.length(36);
    Code.expect(payload.data.verification_code).to.have.length(5);

    verificationId = payload.data.verification_id;
    verificationCode = payload.data.verification_code;

    console.log('verificationId', verificationId, 'verificationCode', verificationCode);
  });

  lab.test('The API should save verification documents list', async () => {
    const request = {
      method: 'POST',
      url: `/crm/1.0/verification/${verificationId}/documents`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        document_id: [documentHeaderId]
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    const payload = JSON.parse(res.payload);
    Code.expect(payload.error).to.equal(null);
    console.log('task 1 stop');
  });

  lab.test('The API should get verification documents list', async () => {
    const request = {
      method: 'GET',
      url: `/crm/1.0/verification/${verificationId}/documents`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    const payload = JSON.parse(res.payload);
    Code.expect(payload.error).to.equal(null);
    Code.expect(payload.data).to.equal([
      {verification_id: verificationId, document_id: documentHeaderId}
    ]);
  });

  lab.test('The API should update documents to verified by verification_id', async () => {
    console.log('The API should update documents to verified by verification_id');

    const request = {
      method: 'PATCH',
      url: `/crm/1.0/documentHeader?filter=` + JSON.stringify({verification_id: verificationId}),
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        verified: 1,
        company_entity_id: companyEntityId
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);
  });

  lab.test('The API should update verification record to supplied timestamp', async () => {
    console.log('The API should update verification record to supplied timestamp');

    const request = {
      method: 'PATCH',
      url: `/crm/1.0/verification/${verificationId}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        date_verified: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    };
    const res = await server.inject(request);

    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
  });

  lab.test('The API should be able to check a verification code', async () => {
    const request = {
      method: 'GET',
      url: `/crm/1.0/verification/${verificationId}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    };

    const res = await server.inject(request);

    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);

    Code.expect(payload.data.verification_code).to.equal(verificationCode);
  });
});
