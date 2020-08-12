'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const companiesRepo = require('../../../../src/v2/connectors/repository/companies');
const Company = require('../../../../src/v2/connectors/bookshelf/Company');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/companies', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ id: 'test-id' })
    };

    stub = {
      save: sandbox.stub().resolves(model),
      fetch: sandbox.stub().resolves(model)
    };

    sandbox.stub(Company, 'forge').returns(stub);
    sandbox.stub(repoHelpers, 'deleteTestData');
    sandbox.stub(repoHelpers, 'deleteOne');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.create', () => {
    let result;
    let person;

    beforeEach(async () => {
      person = { type: 'person', name: 'test-name' };
      result = await companiesRepo.create(person);
    });

    test('.forge() is called on the model with the data', async () => {
      const [data] = Company.forge.lastCall.args;
      expect(data).to.equal(person);
    });

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.id).to.equal('test-id');
    });
  });

  experiment('.findOne', () => {
    let result;

    experiment('when the id matches a company', () => {
      beforeEach(async () => {
        result = await companiesRepo.findOne('test-id');
      });

      test('.forge() is called on the model with the data', async () => {
        const [data] = Company.forge.lastCall.args;
        expect(data).to.equal({ companyId: 'test-id' });
      });

      test('.fetch() is called after the forge', async () => {
        expect(stub.fetch.called).to.equal(true);
      });

      test('the JSON representation is returned', async () => {
        expect(model.toJSON.called).to.be.true();
        expect(result.id).to.equal('test-id');
      });
    });

    experiment('when the id does not find a company', () => {
      beforeEach(async () => {
        stub.fetch.resolves(null);
        result = await companiesRepo.findOne('test-id');
      });

      test('.forge() is called on the model with the data', async () => {
        const [data] = Company.forge.lastCall.args;
        expect(data).to.equal({ companyId: 'test-id' });
      });

      test('.fetch() is called after the forge', async () => {
        expect(stub.fetch.called).to.equal(true);
      });

      test('null is returned', async () => {
        expect(result).to.equal(null);
      });
    });
  });

  experiment('.deleteOne', () => {
    test('uses the repository helpers deleteOne function', async () => {
      await companiesRepo.deleteOne('test-company-id');

      const [model, idKey, id] = repoHelpers.deleteOne.lastCall.args;
      expect(model).to.equal(Company);
      expect(idKey).to.equal('companyId');
      expect(id).to.equal('test-company-id');
    });
  });

  experiment('.deleteTestData', () => {
    test('is deleted using the helpers', async () => {
      await companiesRepo.deleteTestData();

      const [model] = repoHelpers.deleteTestData.lastCall.args;
      expect(model).to.equal(Company);
    });
  });
});
