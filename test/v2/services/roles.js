'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const uuid = require('uuid/v4');
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const rolesRepo = require('../../../src/v2/connectors/repository/roles');
const rolesService = require('../../../src/v2/services/roles');

experiment('services/roles', () => {
  beforeEach(async () => {
    sandbox.stub(rolesRepo, 'findOneByName');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getRoleByName', () => {
    test('returns the result from the repo', async () => {
      const roleId = uuid();
      const role = { roleId };
      rolesRepo.findOneByName.resolves(role);

      const result = await rolesService.getRoleByName('licenceHolder');

      expect(rolesRepo.findOneByName.calledWith('licenceHolder')).to.equal(true);
      expect(result).to.equal(role);
    });
  });
});
