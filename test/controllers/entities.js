'use strict';

const Lab = require('lab');
const { experiment, beforeEach, afterEach, test } = exports.lab = Lab.script();
const { expect } = require('code');
const helpers = require('../helpers');

const controller = require('../../src/controllers/entities');

experiment('create', () => {
  const createdEntities = [];

  afterEach(async () => {
    for (const entity of createdEntities) {
      await helpers.deleteEntity(entity.entity_id);
    }
  });

  test('a company can be saved with upper case name', async () => {
    const created = await helpers.createEntity('COMPANY');
    createdEntities.push(created);
    expect(created.entity_nm).to.equal('COMPANY@example.com');
  });

  test('an individual entity name is lower cased', async () => {
    const created = await helpers.createEntity('INDIVIDUAL');
    createdEntities.push(created);
    expect(created.entity_nm).to.equal('individual@example.com');
  });

  test('created_at timestamp is added', async () => {
    const created = await helpers.createEntity('created test');
    createdEntities.push(created);
    expect(created.created_at).to.exist();
  });
});

experiment('getEntityCompanies', () => {
  let regime;
  let companyOne;
  let companyTwo;
  let userEntity;
  let roles = [];
  let request;

  beforeEach(async () => {
    regime = await helpers.createEntity('regime');
    companyOne = await helpers.createEntity('company');
    companyTwo = await helpers.createEntity('company');
    userEntity = await helpers.createEntity('individual');
    roles.push(await helpers.createEntityRole(
      regime.entity_id,
      companyOne.entity_id,
      userEntity.entity_id,
      'role-a'
    ));

    roles.push(await helpers.createEntityRole(
      regime.entity_id,
      companyOne.entity_id,
      userEntity.entity_id,
      'role-b'
    ));

    roles.push(await helpers.createEntityRole(
      regime.entity_id,
      companyTwo.entity_id,
      userEntity.entity_id,
      'role-a'
    ));

    request = {
      params: {
        entity_id: userEntity.entity_id
      }
    };
  });

  afterEach(async () => {
    for (const role of roles) {
      await helpers.deleteEntityRole(userEntity.entity_id, role.entity_role_id);
    }

    const entityIds = [
      userEntity.entity_id,
      companyOne.entity_id,
      companyTwo.entity_id,
      regime.entity_id
    ];

    for (const entityId of entityIds) {
      await helpers.deleteEntity(entityId);
    }
  });

  test('the response data contains the entity id', async () => {
    const companiesResponse = await controller.getEntityCompanies(request);
    expect(companiesResponse.data.entityId).to.equal(userEntity.entity_id);
  });

  test('the response data contains the entity name', async () => {
    const companiesResponse = await controller.getEntityCompanies(request);
    expect(companiesResponse.data.entityName).to.equal(userEntity.entity_nm);
  });

  test('all the expected companies are returned', async () => {
    const companiesResponse = await controller.getEntityCompanies(request);
    expect(companiesResponse.data.companies.length).to.equal(2);
  });

  test('the user has two roles in company one', async () => {
    const companiesResponse = await controller.getEntityCompanies(request);
    const result = companiesResponse.data.companies.find(c => {
      return c.entityId === companyOne.entity_id;
    });
    expect(result.userRoles).to.have.length(2);
    expect(result.userRoles).to.once.include(['role-a', 'role-b']);
  });

  test('the user has one role in company two', async () => {
    const companiesResponse = await controller.getEntityCompanies(request);
    const result = companiesResponse.data.companies.find(c => {
      return c.entityId === companyTwo.entity_id;
    });
    expect(result.userRoles).to.have.length(1);
    expect(result.userRoles).to.once.include(['role-a']);
  });

  test('returns a 404 if there are no results', async () => {
    request = { params: { entity_id: '00000000-0000-0000-0000-000000000000' } };
    const response = await controller.getEntityCompanies(request);
    expect(response.output.statusCode).to.equal(404);
    expect(response.isBoom).to.be.true();
  });
});
