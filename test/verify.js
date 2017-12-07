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

const Code = require('code')
const server = require('../index')

let individualEntityId = null;
let companyEntityId = null;


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



lab.experiment('Check verification', () => {

  lab.before((cb) => {
    createEntity('individual')
      .then((res) => {
        individualEntityId = res.entity_id;
        return createEntity('company');
      })
      .then((res) => {
        companyEntityId = res.entity_id;
      })
      .then(() => {
        cb();
      });
  });

  lab.after((cb) => {
    deleteEntity(individualEntityId)
      .then(() => {
        return deleteEntity(companyEntityId);
      })
      .then(() => {
        cb();
      });
  });

  lab.test('The page should verify', async () => {

  })





})
