'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const companyAddressesRepo = require('../../../../src/v2/connectors/repository/company-addresses');
const CompanyAddress = require('../../../../src/v2/connectors/bookshelf/CompanyAddress');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/company-addresses', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ companyAddressId: 'test-id' })
    };

    stub = {
      save: sandbox.stub().resolves(model),
      fetch: sandbox.stub().resolves(model)
    };

    sandbox.stub(CompanyAddress, 'forge').returns(stub);
    sandbox.stub(repoHelpers, 'deleteTestData');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.create', () => {
    let result;
    let companyAddress;

    beforeEach(async () => {
      companyAddress = {
        companyId: 'company-id',
        addressId: 'address-id',
        roleId: 'role-id',
        startDate: '2019-01-01',
        endDate: null
      };
      result = await companyAddressesRepo.create(companyAddress);
    });

    test('.forge() is called on the model with the data', async () => {
      const [data] = CompanyAddress.forge.lastCall.args;
      expect(data).to.equal(companyAddress);
    });

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.companyAddressId).to.equal('test-id');
    });
  });

  experiment('.deleteTestData', () => {
    test('is created using the helpers', async () => {
      await companyAddressesRepo.deleteTestData();

      const [model] = repoHelpers.deleteTestData.lastCall.args;
      expect(model).to.equal(CompanyAddress);
    });
  });
});
