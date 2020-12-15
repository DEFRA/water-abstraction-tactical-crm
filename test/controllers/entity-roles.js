'use strict';

const server = require('../../index');
const { version } = require('../../config');
const uuid = require('uuid/v4');
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const { pool } = require('../../src/lib/connectors/db');

const { expect } = require('@hapi/code');

const createRequest = (entityId, method = 'GET') => {
  const url = `/crm/${version}/entity/${entityId}/roles`;

  return {
    method,
    url,
    headers: { Authorization: process.env.JWT_TOKEN }
  };
};

const deleteEntityRoles = async () => {
  const query = `
    delete
    from crm.entity_roles
    where role = 'unit_test_user';`;

  await pool.query(query);
};

lab.experiment('entity-roles controller', () => {
  lab.before(async () => {
    await server._start();
  });

  lab.afterEach(deleteEntityRoles);

  lab.test('The API should create an entity role', async () => {
    const entityId = uuid();
    const request = createRequest(entityId, 'POST');
    request.payload = {
      entity_id: entityId,
      role: 'unit_test_user'
    };

    const res = await server.inject(request);
    expect(res.statusCode).to.equal(201);

    const payload = JSON.parse(res.payload);
    expect(payload.error).to.equal(null);
    expect(payload.data.entity_role_id).to.be.a.string();
    expect(payload.data.entity_id).to.equal(entityId);
    expect(payload.data.role).to.equal('unit_test_user');
  });
});
