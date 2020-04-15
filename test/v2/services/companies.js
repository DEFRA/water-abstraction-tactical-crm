'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const companiesService = require('../../../src/v2/services/companies');
const repos = require('../../../src/v2/connectors/repository');

experiment('services/companies', () => {
  beforeEach(async () => {
    sandbox.stub(repos.companies, 'create').resolves({
      companyId: 'test-company-id'
    });

    sandbox.stub(repos.companies, 'findOne').resolves({
      companyId: 'test-company-id'
    });
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.createPerson', () => {
    test('can create a test record', async () => {
      await companiesService.createPerson('test-name', true);

      const [person] = repos.companies.create.lastCall.args;
      expect(person.name).to.equal('test-name');
      expect(person.type).to.equal('person');
      expect(person.isTest).to.equal(true);
    });

    test('creates a non test record by default', async () => {
      await companiesService.createPerson('test-name');

      const [person] = repos.companies.create.lastCall.args;
      expect(person.name).to.equal('test-name');
      expect(person.type).to.equal('person');
      expect(person.isTest).to.equal(false);
    });

    test('returns the result from the datbase', async () => {
      const result = await companiesService.createPerson('test-name');
      expect(result.companyId).to.equal('test-company-id');
    });
  });

  experiment('.createOrganisation', () => {
    test('can create a test record', async () => {
      await companiesService.createOrganisation('test-name', 'test-number', true);

      const [organisation] = repos.companies.create.lastCall.args;
      expect(organisation.name).to.equal('test-name');
      expect(organisation.companyNumber).to.equal('test-number');
      expect(organisation.type).to.equal('organisation');
      expect(organisation.isTest).to.equal(true);
    });

    test('creates a non test record by default', async () => {
      await companiesService.createOrganisation('test-name', 'test-number');

      const [organisation] = repos.companies.create.lastCall.args;
      expect(organisation.name).to.equal('test-name');
      expect(organisation.type).to.equal('organisation');
      expect(organisation.companyNumber).to.equal('test-number');
      expect(organisation.isTest).to.equal(false);
    });

    test('creates a null company number by default', async () => {
      await companiesService.createOrganisation('test-name');

      const [organisation] = repos.companies.create.lastCall.args;
      expect(organisation.name).to.equal('test-name');
      expect(organisation.type).to.equal('organisation');
      expect(organisation.companyNumber).to.equal(null);
      expect(organisation.isTest).to.equal(false);
    });

    test('returns the result from the datbase', async () => {
      const result = await companiesService.createOrganisation('test-name');
      expect(result.companyId).to.equal('test-company-id');
    });
  });

  experiment('.getCompany', async () => {
    test('returns the data from the repository', async () => {
      repos.companies.findOne.resolves({
        type: 'person',
        name: 'test-name',
        companyId: 'test-id'
      });

      const company = await companiesService.getCompany('test-id');

      expect(company).to.equal({
        type: 'person',
        name: 'test-name',
        companyId: 'test-id'
      });
    });
  });
});
