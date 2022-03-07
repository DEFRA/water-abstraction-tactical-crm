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
const raw = require('../../../../src/v2/connectors/repository/lib/raw');
const queries = require('../../../../src/v2/connectors/repository/queries/companies');

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

    sandbox.stub(raw, 'multiRow').returns();
    sandbox.stub(Company, 'forge').returns(stub);
    sandbox.stub(repoHelpers, 'deleteTestData');
    sandbox.stub(repoHelpers, 'deleteOne');
    sandbox.stub(repoHelpers, 'findOne');
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
    const ID = 'test-id';
    beforeEach(async () => {
      await companiesRepo.findOne(ID);
    });

    test('uses the .findOne repo helper', async () => {
      expect(repoHelpers.findOne.calledWith(
        Company, 'companyId', ID
      )).to.be.true();
    });
  });

  experiment('.findAllByName', () => {
    let result, tempCompany;

    experiment('when the id matches a company', () => {
      beforeEach(async () => {
        tempCompany = new Company({
          name: 'Test Limited'
        });

        sandbox.stub(companiesRepo, 'findAllByName').resolves([tempCompany]);

        result = await companiesRepo.findAllByName('test', true);
      });

      test('returns an array', async () => {
        expect(result).to.equal([tempCompany]);
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

  experiment('.findOneByCompanyNumber', () => {
    const COMPANY_NUMBER = 'test-company-number';

    beforeEach(async () => {
      await companiesRepo.findOneByCompanyNumber(COMPANY_NUMBER);
    });

    test('uses the .findOne repo helper', async () => {
      expect(repoHelpers.findOne.calledWith(
        Company, 'companyNumber', COMPANY_NUMBER)
      ).to.be.true();
    });
  });

  experiment('.findLicencesByCompanyId', () => {
    const companyId = 'test-company-id';

    beforeEach(async () => {
      await companiesRepo.findLicencesByCompanyId(companyId);
    });

    test('calls multiRow', async () => {
      expect(raw.multiRow.calledWith(
        queries.findLicencesByCompanyId, { companyId })
      ).to.be.true();
    });
  });

  experiment('.getCompanyWAAEmailContacts', () => {
    const companyId = 'test-company-id';

    beforeEach(async () => {
      await companiesRepo.getCompanyWAAEmailContacts(companyId);
    });

    test('calls multiRow', async () => {
      expect(raw.multiRow.calledWith(
        queries.getCompanyWAAEmailContacts, { companyId })
      ).to.be.true();
    });
  });
});
