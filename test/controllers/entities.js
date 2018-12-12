'use strict';

const Lab = require('lab');
const { experiment, afterEach, test } = exports.lab = Lab.script();
const { expect } = require('code');
const { createEntity, deleteEntity } = require('../helpers');

experiment('create', () => {
  const createdEntities = [];

  afterEach(async() => {
    for (const entity of createdEntities) {
      await deleteEntity(entity.entity_id);
    }
  });

  test('a company can be saved with upper case name', async () => {
    const created = await createEntity('COMPANY');
    createdEntities.push(created);
    expect(created.entity_nm).to.equal('COMPANY@example.com');
  });

  test('an individual entity name is lower cased', async () => {
    const created = await createEntity('INDIVIDUAL');
    createdEntities.push(created);
    expect(created.entity_nm).to.equal('individual@example.com');
  });

  test('created_at timestamp is added', async () => {
    const created = await createEntity('created test');
    createdEntities.push(created);
    expect(created.created_at).to.exist();
  });
});
