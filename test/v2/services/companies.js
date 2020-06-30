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

    sandbox.stub(repos.companyContacts, 'create').resolves({
      companyContactId: 'test-company-contact-id'
    });

    sandbox.stub(repos.companyAddresses, 'findManyByCompanyId').resolves([{
      companyAddressId: 'test-company-address-id'
    }]);

    sandbox.stub(repos.companyContacts, 'findManyByCompanyId').resolves([{
      companyContactId: 'test-company-contact-id'
    }]);
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

  experiment('.addContact', async () => {
    test('can create a test record', async () => {
      await companiesService.addContact('test-company-id', 'test-contact-id', {
        roleId: 'test-role-id',
        startDate: '2020-01-01'
      }, true);

      const [companyContact] = repos.companyContacts.create.lastCall.args;
      expect(companyContact.companyId).to.equal('test-company-id');
      expect(companyContact.contactId).to.equal('test-contact-id');
      expect(companyContact.roleId).to.equal('test-role-id');
      expect(companyContact.isTest).to.equal(true);
    });

    test('creates a non-test record by default', async () => {
      await companiesService.addContact('test-company-id', 'test-contact-id', {
        roleId: 'test-role-id',
        startDate: '2020-01-01'
      });

      const [companyContact] = repos.companyContacts.create.lastCall.args;
      expect(companyContact.companyId).to.equal('test-company-id');
      expect(companyContact.contactId).to.equal('test-contact-id');
      expect(companyContact.roleId).to.equal('test-role-id');
      expect(companyContact.isTest).to.equal(false);
    });

    experiment('when there is a unique constraint violation error', async () => {
      beforeEach(async () => {
        const err = new Error();
        err.code = '23505';
        repos.companyContacts.create.rejects(err);
      });

      test('a UniqueConstraintViolation error is thrown', async () => {
        const func = () => companiesService.addContact('test-company-id', 'test-contact-id', {
          roleId: 'test-role-id',
          startDate: '2020-01-01'
        });
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.UniqueConstraintViolation).to.be.true();
      });
    });

    experiment('when there is a unique constraint violation error', async () => {
      beforeEach(async () => {
        const err = new Error();
        err.code = '23503';
        repos.companyContacts.create.rejects(err);
      });

      test('a ForeignKeyConstraintViolation error is thrown', async () => {
        const func = () => companiesService.addContact('test-company-id', 'test-contact-id', {
          roleId: 'test-role-id',
          startDate: '2020-01-01'
        });
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.ForeignKeyConstraintViolation).to.be.true();
      });
    });

    experiment('when there is an unknown error', async () => {
      beforeEach(async () => {
        const err = new Error('oops');
        repos.companyContacts.create.rejects(err);
      });

      test('the error is rethrown', async () => {
        const func = () => companiesService.addContact('test-company-id', 'test-contact-id', {
          roleId: 'test-role-id',
          startDate: '2020-01-01'
        });
        const err = await expect(func()).to.reject();
        expect(err.message).to.equal('oops');
      });
    });
  });

  experiment('.getAddresses', () => {
    const companyId = 'test-company-id';
    let result;

    experiment('when the company is found', () => {
      beforeEach(async () => {
        result = await companiesService.getAddresses(companyId);
      });

      test('the company is found by ID to check it exists', async () => {
        expect(repos.companies.findOne.calledWith(companyId));
      });

      test('the addresses are found', async () => {
        expect(repos.companyAddresses.findManyByCompanyId.calledWith(
          companyId
        )).to.be.true();
      });

      test('resolves with the CompanyAddresses', async () => {
        expect(result[0].companyAddressId).to.equal('test-company-address-id');
      });
    });

    experiment('when the company is not found', () => {
      beforeEach(async () => {
        repos.companies.findOne.resolves(null);
      });

      test('rejects with a NotFoundError', async () => {
        const func = () => companiesService.getAddresses(companyId);
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.NotFoundError).to.be.true();
        expect(err.message).to.equal('Company not found test-company-id');
      });
    });
  });

  experiment('.getContacts', () => {
    const companyId = 'test-company-id';
    let result;

    experiment('when the company is found', () => {
      beforeEach(async () => {
        result = await companiesService.getContacts(companyId);
      });

      test('the company is found by ID to check it exists', async () => {
        expect(repos.companies.findOne.calledWith(companyId));
      });

      test('the contacts are found', async () => {
        expect(repos.companyContacts.findManyByCompanyId.calledWith(
          companyId
        )).to.be.true();
      });

      test('resolves with the CompanyContacts', async () => {
        expect(result[0].companyContactId).to.equal('test-company-contact-id');
      });
    });

    experiment('when the company is not found', () => {
      beforeEach(async () => {
        repos.companies.findOne.resolves(null);
      });

      test('rejects with a NotFoundError', async () => {
        const func = () => companiesService.getContacts(companyId);
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.NotFoundError).to.be.true();
        expect(err.message).to.equal('Company not found test-company-id');
      });
    });
  });
});
