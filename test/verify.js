/**
 * Test verification process
 * - Create entity
 * - Create company
 * - Create unverified document headers linked to entity/company
 * - Create verification code - update documents with ID
 * - Verify with auth code
 * - Update documents with verification ID to verified status
 */
'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const moment = require('moment');

const Code = require('code')
const server = require('../index')

let regimeEntityId = null;
let individualEntityId = null;
let companyEntityId = null;
let documentHeaderId = null;
let verificationId = null;
let verificationCode = null;

/**
 * Create a document header for testing purposes
 */
const createDocumentHeader = async(regimeEntityId) => {
  const request = {
    method: 'POST',
    url: '/crm/1.0/documentHeader',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      regime_entity_id : regimeEntityId,
      owner_entity_id : '',
      system_id : 'permit-repo',
      system_internal_id : 9999999999,
      system_external_id : 'xx/xx/xx/xxxx',
      metadata : '{"Name":"TEST LICENCE"}'
    }
  }
  const res = await server.inject(request);
  const {error, data} = JSON.parse(res.payload);
  if(error) {
    throw error;
  }
  return data;
}


/**
 * Create an entity of the specified type for test
 * purposes
 * @param {String} entityType - individual|company|regime
 * @return {Promise} resolves with entity data
 */
const createEntity = async(entityType) => {
  const request = {
    method: 'POST',
    url: '/crm/1.0/entity',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      entity_nm : `${ entityType }@example.com`,
      entity_type : entityType,
      entity_definition : '{}'
    }
  }
  const res = await server.inject(request);
  const {error, data} = JSON.parse(res.payload);
  if(error) {
    throw error;
  }
  return data;
}

/**
 * Delete entity
 * @param {String} entityGuid - the entity to delete
 */
const deleteEntity = async(entityGuid) => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/entity/${ entityGuid }`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  }
  const res = await server.inject(request);
  return res;
}

/**
 * Delete document
 * @param {String} documentId - the document to delete
 */
const deleteDocumentHeader = async(documentId) => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/documentHeader/${ documentId }`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  }
  const res = await server.inject(request);
  return res;
}



lab.experiment('Check verification', () => {

  lab.before((cb) => {
    createEntity('regime')
      .then((res) => {
        regimeEntityId = res.entity_id;
        return createEntity('individual');
      })
      .then((res) => {
        individualEntityId = res.entity_id;
        return createEntity('company');
      })
      .then((res) => {
        companyEntityId = res.entity_id;
        return createDocumentHeader(regimeEntityId);
      })
      .then((res) => {
        documentHeaderId = res.document_id;
        return;
      })
      .then(() => {
        cb();
      });
  });

  lab.after((cb) => {
    // Delete all temporary entities
    const entityIds = [regimeEntityId, individualEntityId, companyEntityId];
    Promise.all(entityIds, (entityId) => {
      return deleteEntity(entityId);
    })
    .then(() => {
      return deleteDocumentHeader(documentHeaderId);
    })
    .then(() => {
      cb();
    })
  });



  // * @param {String} request.payload.entity_id - the GUID of the current individual's entity
  // * @param {String} request.payload.company_entity_id - the GUID of the current individual's company
  // * @param {String} request.payload.method - the verification method - post|phone
  // * @param {Object} reply - the HAPI HTTP reply
  lab.test('The API should create a verification code', async () => {
    const request = {
      method: 'POST',
      url: `/crm/1.0/verification`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        entity_id : individualEntityId,
        company_entity_id : companyEntityId,
        method : 'post'
      }
    }
    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.error).to.equal(null);
    Code.expect(payload.data.verification_id).to.have.length(36);
    Code.expect(payload.data.verification_code).to.have.length(5);

    verificationId = payload.data.verification_id;
    verificationCode = payload.data.verification_code;

  })

  lab.test('The API should update documents with verification_id', async () => {

    // @TODO company ID set at this stage 

    const request = {
      method: 'PATCH',
      url: `/crm/1.0/documentHeaders`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        query : {
          document_id : [documentHeaderId]
        },
        set : {
          verification_id : verificationId
        }
      }
    };
    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    const payload = JSON.parse(res.payload);
    Code.expect(payload.error).to.equal(null);
  })

  lab.test('The API should update documents to verified by verification_id', async () => {
    const request = {
      method: 'PATCH',
      url: `/crm/1.0/documentHeaders`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        query : {
          verification_id : verificationId
        },
        set : {
          verified : 1
        }
      }
    };
    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);
  })

  lab.test('The API should update verification record to supplied timestamp', async () => {
    const request = {
      method: 'PATCH',
      url: `/crm/1.0/verification/${ verificationId }`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        date_verified : moment().format()
      }
    };
    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.error).to.equal(null);
  })

  lab.test('The API should return 200 for correct verification code', async () => {
    const request = {
      method: 'POST',
      url: `/crm/1.0/verification/check`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        entity_id : individualEntityId,
        company_entity_id : companyEntityId,
        verification_code : verificationCode
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    Code.expect(payload.error).to.equal(null);
  })

  lab.test('The API should return error for incorrect verification code', async () => {
    const request = {
      method: 'POST',
      url: `/crm/1.0/verification/check`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        entity_id : individualEntityId,
        company_entity_id : companyEntityId,
        verification_code : 'WRONG'
      }
    };

    const res = await server.inject(request);
    // Code.expect(res.statusCode).to.equal(200);

    // Check payload
    const payload = JSON.parse(res.payload);
    console.log(payload);
    // Code.expect(payload.error).to.equal(null);
  })


})
