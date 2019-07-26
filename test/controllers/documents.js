const { expect } = require('@hapi/code');
const { beforeEach, afterEach, experiment, test } = exports.lab = require('@hapi/lab').script();
const helpers = require('../helpers');
const { pool } = require('../../src/lib/connectors/db');
const { logger } = require('../../src/logger');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const controller = require('../../src/controllers/documents');

experiment('getDocumentUsers', () => {
  let regimeEntity;
  let companyEntity;
  let userEntity;
  let userRoleEntity1;
  let userRoleEntity2;
  let documentHeader;
  let response;

  beforeEach(async () => {
    regimeEntity = await helpers.createEntity('regime');
    companyEntity = await helpers.createEntity('company');
    userEntity = await helpers.createEntity('user', { entity_type: 'individual' });
    userRoleEntity1 = await helpers.createEntityRole(
      regimeEntity.entity_id,
      companyEntity.entity_id,
      userEntity.entity_id,
      'primary_user'
    );
    userRoleEntity2 = await helpers.createEntityRole(
      regimeEntity.entity_id,
      companyEntity.entity_id,
      userEntity.entity_id,
      'user_returns'
    );

    sandbox.stub(logger, 'error');

    documentHeader = await helpers.createDocumentHeader(regimeEntity.entity_id, companyEntity.entity_id);

    response = await controller.getDocumentUsers({ params: { documentId: documentHeader.document_id } });
  });

  afterEach(async () => {
    sandbox.restore();
    await helpers.deleteDocumentHeader(documentHeader.document_id);
    await helpers.deleteEntityRole(userEntity.entity_id, userRoleEntity2.entity_role_id);
    await helpers.deleteEntityRole(userEntity.entity_id, userRoleEntity1.entity_role_id);
    await helpers.deleteEntity(userEntity.entity_id);
    await helpers.deleteEntity(companyEntity.entity_id);
    await helpers.deleteEntity(regimeEntity.entity_id);
  });

  test('returns a 404 for an incorrect document id', async () => {
    const request = { params: { documentId: '00000000-0000-0000-0000-000000000000' } };
    const response = await controller.getDocumentUsers(request);
    expect(response.output.statusCode).to.equal(404);
  });

  test('response shape', async () => {
    expect(response.data.length).to.equal(1);
    expect(response.error).to.be.null();

    const user = response.data[0];

    expect(user.entityId).to.equal(userEntity.entity_id);
    expect(user.entityName).to.equal(userEntity.entity_nm);
    expect(user.roles).to.have.length(2);
    expect(user.roles).to.only.include(['user_returns', 'primary_user']);
  });

  test('logs any unexpected error', async () => {
    sandbox.stub(pool, 'query').rejects({ name: 'error' });
    const request = { params: { documentId: '00000000-0000-0000-0000-000000000000' } };
    const response = await controller.getDocumentUsers(request);

    const [message, error] = logger.error.lastCall.args;
    expect(message).to.equal('Error getting document users');
    expect(error.name).to.equal('error');

    expect(response.output.statusCode).to.equal(500);
  });
});
