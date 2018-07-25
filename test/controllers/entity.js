'use strict';

const server = require('../../index');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const { expect } = require('code');

const entityIds = [];

/**
 * Create an entity of the specified type for test
 * purposes
 * @param {String} entityType - individual|company|regime
 * @return {Promise} resolves with entity data
 */
const createEntity = async (entityType, entityName) => {
  console.log(`Creating entity ${entityType} ${entityName}`);
  const request = {
    method: 'POST',
    url: '/crm/1.0/entity',
    headers: {
      Authorization: process.env.JWT_TOKEN
    },
    payload: {
      entity_nm: entityName,
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
  entityIds.push(data.entity_id);
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

lab.experiment('entity controller', () => {
  lab.after(async() => {
    for (let id of entityIds) {
      await deleteEntity(id);
    }
  });

  lab.test('The API should lowercase an entity with email address as name', async () => {
    const data = await createEntity('individual', '  MAIL@EXAMPLE.COM  ');
    expect(data.entity_nm).to.equal('mail@example.com');
  });

  lab.test('The API should not alter case of an entity without email address as name', async () => {
    const data = await createEntity('company', '  DAISY FARM  ');
    expect(data.entity_nm).to.equal('DAISY FARM');
  });
});
