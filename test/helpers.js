const server = require('../index');
const uuidv4 = require('uuid/v4');

/**
 * Create a document header for testing purposes
 */
const createDocumentHeader = async (regimeEntityId, companyEntityId = null) => {
  const request = {
    method: 'POST',
    url: '/crm/1.0/documentHeader',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      regime_entity_id: regimeEntityId,
      company_entity_id: companyEntityId,
      system_id: 'permit-repo',
      system_internal_id: uuidv4(),
      system_external_id: uuidv4(),
      metadata: '{"Name":"TEST LICENCE", "IsCurrent" : true}'
    }
  };
  console.log('payload >>>', request.payload);
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

/**
 * Delete document
 * @param {String} documentId - the document to delete
 */
const createEntityRole = async(regimeId, companyEntityId, entityId, role = 'test_role') => {
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
  const res = await server.inject(request);
  const {error, data} = JSON.parse(res.payload);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

/**
 * Delete entity role
 * @param {String} documentId - the document to delete
 */
const deleteEntityRole = async(entityId, entityRoleId) => {
  const request = {
    method: 'DELETE',
    url: `/crm/1.0/entity/${entityId}/roles/${entityRoleId}`,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };
  const res = await server.inject(request);
  return res;
};

module.exports = {
  createDocumentHeader,
  createEntity,
  deleteEntity,
  deleteDocumentHeader,
  createEntityRole,
  deleteEntityRole
};