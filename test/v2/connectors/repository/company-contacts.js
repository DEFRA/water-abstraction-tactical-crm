'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const companyContactsRepo = require('../../../../src/v2/connectors/repository/company-contacts');
const CompanyContact = require('../../../../src/v2/connectors/bookshelf/CompanyContact');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/company-contacts', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ companyContactId: 'test-id' })
    };

    stub = {
      save: sandbox.stub().resolves(model),
      fetch: sandbox.stub().resolves(model),
      where: sandbox.stub().returnsThis()
    };

    sandbox.stub(CompanyContact, 'forge').returns(stub);
    sandbox.stub(CompanyContact, 'collection').returns(stub);

    sandbox.stub(repoHelpers, 'deleteTestData');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.create', () => {
    let result;
    let companyContact;

    beforeEach(async () => {
      companyContact = {
        companyId: 'company-id',
        contactId: 'address-id',
        roleId: 'role-id',
        startDate: '2019-01-01',
        endDate: null
      };
      result = await companyContactsRepo.create(companyContact);
    });

    test('.forge() is called on the model with the data', async () => {
      const [data] = CompanyContact.forge.lastCall.args;
      expect(data).to.equal(companyContact);
    });

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.companyContactId).to.equal('test-id');
    });
  });

  experiment('.deleteTestData', () => {
    test('is created using the helpers', async () => {
      await companyContactsRepo.deleteTestData();

      const [model] = repoHelpers.deleteTestData.lastCall.args;
      expect(model).to.equal(CompanyContact);
    });
  });

  experiment('.findManyByCompanyId', () => {
    const companyId = 'company-id';

    beforeEach(async () => {
      await companyContactsRepo.findManyByCompanyId(companyId);
    });

    test('.collection() is called on the model', async () => {
      expect(CompanyContact.collection.called).to.be.true();
    });

    test('.where() is called to get company contacts by company ID', async () => {
      expect(stub.where.calledWith(
        'company_id', companyId
      )).to.be.true();
    });

    test('.fetch() is callled with related contact and role', async () => {
      expect(stub.fetch.calledWith({
        withRelated: ['contact', 'role']
      })).to.be.true();
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
    });
  });
});
