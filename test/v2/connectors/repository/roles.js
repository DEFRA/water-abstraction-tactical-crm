'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const rolesRepo = require('../../../../src/v2/connectors/repository/roles');
const Role = require('../../../../src/v2/connectors/bookshelf/Role');

experiment('v2/connectors/repository/roles', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ roleId: 'test-role-id' })
    };

    stub = {
      where: sandbox.stub().returnsThis(),
      fetch: sandbox.stub().resolves(model)
    };

    sandbox.stub(Role, 'forge').returns(stub);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.findOneByName', () => {
    let result;

    experiment('when the name matches a role', () => {
      beforeEach(async () => {
        result = await rolesRepo.findOneByName('billing');
      });

      test('the name is used in the qurey', async () => {
        const [filter] = stub.where.lastCall.args;
        expect(filter).to.equal({ name: 'billing' });
      });

      test('.fetch() is called and does not require a result', async () => {
        const [fetchOptions] = stub.fetch.lastCall.args;
        expect(fetchOptions).to.equal({ require: false });
      });

      test('the JSON representation is returned', async () => {
        expect(model.toJSON.called).to.be.true();
        expect(result).to.equal({ roleId: 'test-role-id' });
      });
    });

    experiment('when the name does not match a role', () => {
      beforeEach(async () => {
        stub.fetch.resolves(null);
        result = await rolesRepo.findOneByName('boiled eggs');
      });

      test('the name is used in the qurey', async () => {
        const [filter] = stub.where.lastCall.args;
        expect(filter).to.equal({ name: 'boiled eggs' });
      });

      test('.fetch() is called and does not require a result', async () => {
        const [fetchOptions] = stub.fetch.lastCall.args;
        expect(fetchOptions).to.equal({ require: false });
      });

      test('null is returned', async () => {
        expect(result).to.equal(null);
      });
    });
  });
});
