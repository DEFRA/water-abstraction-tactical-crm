'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const { v4: uuid } = require('uuid');

const companiesService = require('../../../src/v2/services/companies');
const repos = require('../../../src/v2/connectors/repository');
const errors = require('../../../src/v2/lib/errors');
const InvoiceAccount = require('../../../src/v2/connectors/bookshelf/InvoiceAccount');

const EXISTING_COMPANY = {
  companyId: uuid()
};

experiment('services/companies', () => {
  let tempInvoiceAccount;

  beforeEach(async () => {
    tempInvoiceAccount = new InvoiceAccount({});

    sandbox.stub(repos.companies, 'create').resolves({
      companyId: 'test-company-id'
    });
    sandbox.stub(repos.companies, 'findOne').resolves({
      companyId: 'test-company-id'
    });
    sandbox.stub(repos.companies, 'findOneByCompanyNumber').resolves(EXISTING_COMPANY);
    sandbox.stub(repos.companies, 'deleteOne').resolves();
    sandbox.stub(repos.companies, 'findAllByName').resolves();

    sandbox.stub(repos.companyAddresses, 'create').resolves({
      companyAddressId: 'test-company-address-id'
    });
    sandbox.stub(repos.companyAddresses, 'findManyByCompanyId').resolves([{
      companyAddressId: 'test-company-address-id'
    }]);
    sandbox.stub(repos.companyAddresses, 'deleteOne').resolves();
    sandbox.stub(repos.companyAddresses, 'findOneByCompanyAddressAndRoleId').resolves({
      companyAddressId: 'test-company-address-id'
    });

    sandbox.stub(repos.companyContacts, 'create').resolves({
      companyContactId: 'test-company-contact-id'
    });
    sandbox.stub(repos.companyContacts, 'findManyByCompanyId').resolves([{
      companyContactId: 'test-company-contact-id'
    }]);
    sandbox.stub(repos.companyContacts, 'deleteOne').resolves();
    sandbox.stub(repos.companyContacts, 'findOneByCompanyRoleContact').resolves();

    sandbox.stub(repos.roles, 'findOneByName').resolves({
      roleId: 'test-role-id'
    });

    sandbox.stub(repos.invoiceAccounts, 'findAllByCompanyId').resolves([tempInvoiceAccount]);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getRoleId', () => {
    test('returns the role id', async () => {
      const result = await companiesService.getRoleId('test-role-name');
      expect(result).to.equal('test-role-id');
    });

    test('throws an error if no role is found', async () => {
      repos.roles.findOneByName.resolves();
      try {
        await companiesService.getRoleId('test-role-name');
      } catch (err) {
        expect(err).to.be.instanceOf(errors.EntityValidationError);
        expect(err.message).to.equal('Role with name: test-role-name not found');
      }
    });
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
      await companiesService.createOrganisation('test-name', 'test-number', 'test-organisation-type', true);

      const [organisation] = repos.companies.create.lastCall.args;
      expect(organisation.name).to.equal('test-name');
      expect(organisation.companyNumber).to.equal('test-number');
      expect(organisation.type).to.equal('organisation');
      expect(organisation.organisationType).to.equal('test-organisation-type');
      expect(organisation.isTest).to.equal(true);
    });

    test('creates a non test record by default', async () => {
      await companiesService.createOrganisation('test-name', 'test-number', 'test-organisation-type');

      const [organisation] = repos.companies.create.lastCall.args;
      expect(organisation.name).to.equal('test-name');
      expect(organisation.type).to.equal('organisation');
      expect(organisation.companyNumber).to.equal('test-number');
      expect(organisation.organisationType).to.equal('test-organisation-type');
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

    test('creates a null organisation type by default', async () => {
      await companiesService.createOrganisation('test-name', 'test-number');

      const [organisation] = repos.companies.create.lastCall.args;
      expect(organisation.name).to.equal('test-name');
      expect(organisation.type).to.equal('organisation');
      expect(organisation.companyNumber).to.equal('test-number');
      expect(organisation.organisationType).to.equal(null);
      expect(organisation.isTest).to.equal(false);
    });

    test('returns the result from the datbase', async () => {
      const result = await companiesService.createOrganisation('test-name');
      expect(result.companyId).to.equal('test-company-id');
    });

    experiment('when there is a unique constraint violation on company number', () => {
      beforeEach(async () => {
        const err = new Error();
        err.code = '23505';
        err.constraint = 'company_number';

        repos.companies.create.rejects(err);
      });

      test('a UniqueConstraintViolation error is thrown', async () => {
        const func = () => companiesService.createOrganisation('test-name');
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.UniqueConstraintViolation).to.be.true();
        expect(err.existingEntity).to.equal(EXISTING_COMPANY);
      });
    });

    experiment('when there is an unexpected error', () => {
      const ERROR = new Error('oops');

      beforeEach(async () => {
        repos.companies.create.rejects(ERROR);
      });

      test('a UniqueConstraintViolation error is thrown', async () => {
        const func = () => companiesService.createOrganisation('test-name');
        const err = await expect(func()).to.reject();
        expect(err).to.equal(ERROR);
      });
    });
  });

  experiment('.searchCompaniesByName', () => {
    experiment('when given a valid string to search', () => {
      test('calls the repo with seach string and soft search=true', async () => {
        await companiesService.searchCompaniesByName('test');
        expect(repos.companies.findAllByName.calledWith('test', true)).to.be.true();
      });

      test('calls the repo with search string and the soft search provided as a second argument', async () => {
        await companiesService.searchCompaniesByName('test', false);
        expect(repos.companies.findAllByName.calledWith('test', false)).to.be.true();
      });
    });
  });

  experiment('.getCompany', () => {
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

  experiment('.addAddress', () => {
    beforeEach(async () => {
      await companiesService.addAddress('test-company-id', 'test-address-id', 'test-role-name',
        {
          startDate: '2020-01-01'
        }, true);
    });

    test('gets the role id from the roles repo', () => {
      expect(repos.roles.findOneByName.calledWith(
        'test-role-name'
      )).to.be.true();
    });

    test('can create a test record', async () => {
      const [companyAddress] = repos.companyAddresses.create.lastCall.args;
      expect(companyAddress.companyId).to.equal('test-company-id');
      expect(companyAddress.addressId).to.equal('test-address-id');
      expect(companyAddress.roleId).to.equal('test-role-id');
      expect(companyAddress.isTest).to.equal(true);
    });

    test('creates a non-test record by default', async () => {
      await companiesService.addAddress('test-company-id', 'test-address-id', 'test-role-name',
        {
          startDate: '2020-01-01'
        });
      const [companyAddress] = repos.companyAddresses.create.lastCall.args;
      expect(companyAddress.companyId).to.equal('test-company-id');
      expect(companyAddress.addressId).to.equal('test-address-id');
      expect(companyAddress.roleId).to.equal('test-role-id');
      expect(companyAddress.isTest).to.equal(false);
    });

    experiment('when there is a unique constraint violation error', () => {
      let result;
      const companyId = 'test-company-id';
      const addressId = 'test-region-id';
      const roleId = 'test-role-id';
      const roleName = 'test-role-name';

      beforeEach(async () => {
        const err = new Error();
        err.code = '23505';
        err.constraint = 'company_role_address';
        repos.companyAddresses.create.rejects(err);

        const func = () => companiesService.addAddress(companyId, addressId, roleName, {
          roleId,
          startDate: '2020-01-01'
        });
        result = await expect(func()).to.reject();
      });

      test('the existing entity is fetched', async () => {
        expect(repos.companyAddresses.findOneByCompanyAddressAndRoleId.calledWith(
          companyId, addressId, roleId
        )).to.be.true();
      });

      test('a UniqueConstraintViolation error is thrown', async () => {
        expect(result instanceof errors.UniqueConstraintViolation);
      });

      test('the error includes the existingEntity object', async () => {
        expect(result.existingEntity).to.be.an.object();
      });
    });

    experiment('when there is an unknown error', () => {
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

  experiment('.addContact', () => {
    beforeEach(async () => {
      await companiesService.addContact('test-company-id', 'test-contact-id', 'test-role-name',
        {
          startDate: '2020-01-01'
        }, true);
    });

    test('gets the role id from the roles repo', () => {
      expect(repos.roles.findOneByName.calledWith(
        'test-role-name'
      )).to.be.true();
    });

    test('can create a test record', async () => {
      const [companyContact] = repos.companyContacts.create.lastCall.args;
      expect(companyContact.companyId).to.equal('test-company-id');
      expect(companyContact.contactId).to.equal('test-contact-id');
      expect(companyContact.roleId).to.equal('test-role-id');
      expect(companyContact.isTest).to.equal(true);
    });

    test('creates a non-test record by default', async () => {
      await companiesService.addContact('test-company-id', 'test-contact-id', 'test-role-name',
        {
          startDate: '2020-01-01'
        });

      const [companyContact] = repos.companyContacts.create.lastCall.args;
      expect(companyContact.companyId).to.equal('test-company-id');
      expect(companyContact.contactId).to.equal('test-contact-id');
      expect(companyContact.roleId).to.equal('test-role-id');
      expect(companyContact.isTest).to.equal(false);
    });

    experiment('when there is a unique constraint violation error', () => {
      const existingEntity = {
        companyContactId: uuid()
      };

      beforeEach(async () => {
        repos.companyContacts.findOneByCompanyRoleContact.resolves(existingEntity);

        const err = new Error();
        err.code = '23505';
        err.constraint = 'company_role_contact';
        repos.companyContacts.create.rejects(err);
      });

      test('a UniqueConstraintViolation error is thrown', async () => {
        const func = () => companiesService.addContact('test-company-id', 'test-contact-id', {
          roleId: 'test-role-id',
          startDate: '2020-01-01'
        });
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.UniqueConstraintViolation).to.be.true();
        expect(err.existingEntity).to.equal(existingEntity);
      });
    });

    experiment('when there is an unknown error', () => {
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

  experiment('.deleteCompany', () => {
    test('calls the deleteOne repo method', async () => {
      await companiesService.deleteCompany('test-company-id');
      expect(repos.companies.deleteOne.calledWith('test-company-id')).to.be.true();
    });
  });

  experiment('.deleteCompanyAddress', () => {
    test('calls the deleteOne repo method', async () => {
      await companiesService.deleteCompanyAddress('test-company-address-id');
      expect(repos.companyAddresses.deleteOne.calledWith('test-company-address-id')).to.be.true();
    });
  });

  experiment('.deleteCompanyContact', () => {
    test('calls the deleteOne repo method', async () => {
      await companiesService.deleteCompanyContact('test-company-contact-id');
      expect(repos.companyContacts.deleteOne.calledWith('test-company-contact-id')).to.be.true();
    });
  });

  experiment('.getCompanyInvoiceAccounts', () => {
    const companyId = uuid();
    test('calls the findAllByCompanyId repo method', async () => {
      await companiesService.getCompanyInvoiceAccounts(companyId);
      expect(repos.invoiceAccounts.findAllByCompanyId.calledWith(companyId)).to.be.true();
    });

    test('responds with an array of invoice accounts', async () => {
      const result = await companiesService.getCompanyInvoiceAccounts(companyId);
      expect(result).to.equal([tempInvoiceAccount]);
    });
  });
});
