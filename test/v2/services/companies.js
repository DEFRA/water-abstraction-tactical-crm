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
const errors = require('../../../src/v2/lib/errors');

experiment('services/companies', () => {
  beforeEach(async () => {
    sandbox.stub(repos.companies, 'create').resolves({
      companyId: 'test-company-id'
    });

    sandbox.stub(repos.companies, 'findOne').resolves({
      companyId: 'test-company-id'
    });

    sandbox.stub(repos.companyAddresses, 'create').resolves({
      companyAddressId: 'test-company-address-id'
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

  experiment('.addAddress', async () => {
    test('can create a test record', async () => {
      await companiesService.addAddress('test-company-id', 'test-address-id', {
        roleId: 'test-role-id',
        startDate: '2020-01-01'
      }, true);

      const [companyAddress] = repos.companyAddresses.create.lastCall.args;
      expect(companyAddress.companyId).to.equal('test-company-id');
      expect(companyAddress.addressId).to.equal('test-address-id');
      expect(companyAddress.roleId).to.equal('test-role-id');
      expect(companyAddress.isTest).to.equal(true);
    });

    test('creates a non-test record by default', async () => {
      await companiesService.addAddress('test-company-id', 'test-address-id', {
        roleId: 'test-role-id',
        startDate: '2020-01-01'
      });

      const [companyAddress] = repos.companyAddresses.create.lastCall.args;
      expect(companyAddress.companyId).to.equal('test-company-id');
      expect(companyAddress.addressId).to.equal('test-address-id');
      expect(companyAddress.roleId).to.equal('test-role-id');
      expect(companyAddress.isTest).to.equal(false);
    });

    experiment('when there is a unique constraint violation error', async () => {
      beforeEach(async () => {
        const err = new Error();
        err.code = '23505';
        repos.companyAddresses.create.rejects(err);
      });

      test('a UniqueConstraintViolation error is thrown', async () => {
        const func = () => companiesService.addAddress('test-company-id', 'test-address-id', {
          roleId: 'test-role-id',
          startDate: '2020-01-01'
        });
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.UniqueConstraintViolation);
      });
    });

    experiment('when there is an unknown error', async () => {
      beforeEach(async () => {
        const err = new Error('oops');
        repos.companyAddresses.create.rejects(err);
      });

      test('the error is rethrown', async () => {
        const func = () => companiesService.addAddress('test-company-id', 'test-address-id', {
          roleId: 'test-role-id',
          startDate: '2020-01-01'
        });
        const err = await expect(func()).to.reject();
        expect(err.message).to.equal('oops');
      });
    });
  });
});
