'use strict';

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const uuid = require('uuid/v4');

const invoiceAccountsAddressService = require('../../../src/v2/services/invoice-account-addresses');
const invoiceAccountsRepo = require('../../../src/v2/connectors/repository/invoice-accounts');
const invoiceAccountAddressesRepo = require('../../../src/v2/connectors/repository/invoice-account-addresses');
const contactsRepo = require('../../../src/v2/connectors/repository/contacts');
const addressesRepo = require('../../../src/v2/connectors/repository/addresses');

const errors = require('../../../src/v2/lib/errors');

const companyId = 'comp-id-1';

const createCompany = () => ({
  companyId,
  name: 'comp-1',
  type: 'organisation',
  companyNumber: '1111',
  externalId: '1111',
  dateCreated: '2019-01-01',
  dateUpdated: '2019-01-01'
});

const createAddress = firstLine => ({
  addressId: 'add-id-1',
  address1: firstLine,
  address2: 'Buttercup meadows',
  address3: null,
  address4: null,
  town: 'Testington',
  county: 'Testingshire',
  country: 'UK'
});

const createInvoiceAccount = id => ({
  invoiceAccountId: id,
  invoiceAccountNumber: 'ia-acc-no-1',
  startDate: '2019-01-01',
  endDate: '2020-01-01',
  dateCreated: '2019-01-01',
  company: createCompany(),
  companyId,
  invoiceAccountAddresses: [{
    startDate: '2019-01-01',
    endDate: '2019-06-01',
    address: createAddress('Buttercup Farm')
  }, {
    startDate: '2019-06-02',
    endDate: null,
    address: createAddress('Daisy Farm')
  }]
});

experiment('v2/services/invoice-accounts', () => {
  beforeEach(() => {
    sandbox.stub(invoiceAccountsRepo, 'create');
    sandbox.stub(invoiceAccountsRepo, 'findOne');
    sandbox.stub(invoiceAccountsRepo, 'findWithCurrentAddress');
    sandbox.stub(invoiceAccountsRepo, 'deleteOne');
    sandbox.stub(invoiceAccountAddressesRepo, 'findAll').resolves([{ startDate: '2018-05-03', endDate: '2020-03-31' }]);
    sandbox.stub(invoiceAccountAddressesRepo, 'create');
    sandbox.stub(invoiceAccountAddressesRepo, 'deleteOne');
    sandbox.stub(invoiceAccountAddressesRepo, 'findOne');
    sandbox.stub(invoiceAccountAddressesRepo, 'update');

    sandbox.stub(contactsRepo, 'findOneWithCompanies').resolves({
      companyContacts: [{
        companyId
      }]
    });
    sandbox.stub(addressesRepo, 'findOneWithCompanies').resolves({
      companyAddresses: [{
        companyId
      }]
    });

    sandbox.stub(invoiceAccountsRepo, 'findOneByGreatestAccountNumber').resolves({
      invoiceAccountNumber: 'A12345678A'
    });
  });

  afterEach(() => sandbox.restore());

  experiment('.createInvoiceAccountAddress', () => {
    beforeEach(async () => {
      invoiceAccountsRepo.findOne.resolves(createInvoiceAccount());
      addressesRepo.findOneWithCompanies.resolves({
        companyAddresses: [{
          companyId
        }]
      });
      contactsRepo.findOneWithCompanies.resolves({
        companyContacts: [{
          companyId
        }]
      });
    });

    experiment('when the invoice account address data is invalid', () => {
      let invoiceAccountAddress;
      beforeEach(() => {
        invoiceAccountAddress = {
          invoiceAccountId: 'not-valid',
          addressId: '123abc',
          startDate: '2020-04-01',
          agentCompanyId: null,
          contactId: null
        };
      });

      test('any EntityValidationError is thrown', async () => {
        const err = await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
          .to.reject(errors.EntityValidationError, 'Invoice account address not valid');

        expect(err.validationDetails).to.be.an.array();
        expect(err.message).to.equal('Invoice account address not valid');
      });

      test('the invoice account address is not saved', async () => {
        expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
      });
    });

    experiment('when there is no agent company', () => {
      let invoiceAccountAddress;

      beforeEach(async () => {
        invoiceAccountAddress = {
          invoiceAccountId: uuid(),
          addressId: uuid(),
          startDate: '2020-04-01',
          agentCompanyId: null,
          contactId: null
        };
      });

      experiment('and the posted address ID does not belong to the licence holder company', () => {
        beforeEach(async () => {
          addressesRepo.findOneWithCompanies.resolves({
            companyAddresses: [{
              companyId: 'some-other-id'
            }]
          });
        });

        test('a ConflictingDataError is thrown', async () => {
          const err = await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified address ${invoiceAccountAddress.addressId} is not in company ${companyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('and the posted address ID belongs to the licence holder company', () => {
        test('no error is thrown', async () => {
          const func = () => invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
          expect(func()).to.not.reject();
        });
      });

      experiment('and the posted contact ID does not belong to the licence holder company', () => {
        beforeEach(async () => {
          invoiceAccountAddress.contactId = uuid();

          contactsRepo.findOneWithCompanies.resolves({
            companyContacts: [{
              companyId: 'some-other-id'
            }]
          });
        });

        test('a ConflictingDataError is thrown', async () => {
          const err = await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified contact ${invoiceAccountAddress.contactId} is not in the company ${companyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('and the posted contact ID belongs to the licence holder company', () => {
        beforeEach(async () => {
          invoiceAccountAddress.contactId = uuid();
        });

        test('no error is thrown', async () => {
          const func = () => invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
          expect(func()).to.not.reject();
        });
      });
    });

    experiment('when there is an agent company', () => {
      let invoiceAccountAddress;

      beforeEach(async () => {
        invoiceAccountAddress = {
          invoiceAccountId: uuid(),
          addressId: uuid(),
          startDate: '2020-04-01',
          agentCompanyId: uuid(),
          contactId: null
        };
      });

      experiment('and the posted address ID does not belong to the agent company', () => {
        beforeEach(async () => {
          addressesRepo.findOneWithCompanies.resolves({
            companyAddresses: [{
              companyId: 'some-other-id'
            }]
          });
        });

        test('a ConflictingDataError is thrown', async () => {
          const err = await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified address ${invoiceAccountAddress.addressId} is not in company ${invoiceAccountAddress.agentCompanyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('and the posted address ID belongs to the agent company', () => {
        beforeEach(async () => {
          addressesRepo.findOneWithCompanies.resolves({
            companyAddresses: [{
              companyId: invoiceAccountAddress.agentCompanyId
            }]
          });
        });

        test('no error is thrown', async () => {
          await invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
        });
      });

      experiment('and the posted contact ID does not belong to the agent company', () => {
        beforeEach(async () => {
          invoiceAccountAddress.contactId = uuid();

          addressesRepo.findOneWithCompanies.resolves({
            companyAddresses: [{
              companyId: invoiceAccountAddress.agentCompanyId
            }]
          });

          contactsRepo.findOneWithCompanies.resolves({
            companyContacts: [{
              companyId: 'some-other-id'
            }]
          });
        });

        test('a ConflictingDataError is thrown', async () => {
          const err = await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified contact ${invoiceAccountAddress.contactId} is not in the company ${invoiceAccountAddress.agentCompanyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('and the posted contact ID belongs to the agent company', () => {
        beforeEach(async () => {
          invoiceAccountAddress.contactId = uuid();

          addressesRepo.findOneWithCompanies.resolves({
            companyAddresses: [{
              companyId: invoiceAccountAddress.agentCompanyId
            }]
          });

          contactsRepo.findOneWithCompanies.resolves({
            companyContacts: [{
              companyId: invoiceAccountAddress.agentCompanyId
            }]
          });
        });

        test('no error is thrown', async () => {
          const func = () => invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
          expect(func()).to.not.reject();
        });
      });
    });

    experiment('when the invoice account address data is valid', async () => {
      let result, invoiceAccountId, invoiceAccountAddress;

      beforeEach(async () => {
        invoiceAccountId = uuid();
        invoiceAccountAddress = {
          invoiceAccountId,
          addressId: uuid(),
          startDate: '2020-04-01',
          agentCompanyId: null,
          contactId: null
        };

        invoiceAccountAddressesRepo.create.resolves({
          invoiceAccountAddressId: 'test-id',
          ...invoiceAccountAddress
        });
      });

      test('invoice account addresses are found', async () => {
        await invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
        expect(
          invoiceAccountAddressesRepo.findAll.calledWith(invoiceAccountId)
        ).to.be.true();
      });

      experiment('when there are no date conflicts', async () => {
        beforeEach(async () => {
          result = await invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
        });

        test('the invoice account address is saved via the repository', async () => {
          expect(invoiceAccountAddressesRepo.create.called).to.equal(true);
        });

        test('the saved invoice account address is returned', async () => {
          expect(result.invoiceAccountAddressId).to.equal('test-id');
        });
      });

      experiment('when there are date conflicts', async () => {
        beforeEach(() => {
          invoiceAccountAddressesRepo.findAll.resolves([
            { startDate: '2016-01-01', endDate: '2018-05-02' },
            { startDate: '2018-05-03', endDate: null }]);
        });

        test('a ConflictingDataError is thrown', async () => {
          const err = await expect(invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject();

          expect(err.name).to.equal('ConflictingDataError');
          expect(err.message).to.equal('Existing invoice account address exists for date range');
        });

        test('the invoice account address is not saved', async () => {
          try {
            await invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
          } catch (err) {
          }
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('when there are no address for the invoice account', async () => {
        beforeEach(async () => {
          invoiceAccountAddressesRepo.findAll.resolves([]);

          result = await invoiceAccountsAddressService.createInvoiceAccountAddress(invoiceAccountAddress);
        });

        test('the invoice account address is saved via the repository', async () => {
          expect(invoiceAccountAddressesRepo.create.called).to.equal(true);
        });

        test('the saved invoice account address is returned', async () => {
          expect(result.invoiceAccountAddressId).to.equal('test-id');
        });
      });
    });
  });

  experiment('.deleteInvoiceAccountAddress', () => {
    test('calls the deleteOne repo method', async () => {
      await invoiceAccountsAddressService.deleteInvoiceAccountAddress('test-invoice-account-address-id');
      expect(invoiceAccountAddressesRepo.deleteOne.calledWith('test-invoice-account-address-id')).to.be.true();
    });
  });

  experiment('.updateInvoiceAccountAddress', () => {
    const invoiceAccountAddressId = uuid();
    const updates = {
      startDate: '2020-01-01',
      endDate: '2020-02-28'
    };

    experiment('when the invoice account address exists and starts before the end date', () => {
      beforeEach(async () => {
        invoiceAccountAddressesRepo.findOne.resolves({
          startDate: '2020-01-01'
        });
        await invoiceAccountsAddressService.updateInvoiceAccountAddress(invoiceAccountAddressId, updates);
      });

      test('the record is fetched from the database', async () => {
        expect(invoiceAccountAddressesRepo.findOne.calledWith(
          invoiceAccountAddressId
        )).to.be.true();
      });
    });

    experiment('when the invoice account address does not exist', () => {
      beforeEach(async () => {
        invoiceAccountAddressesRepo.findOne.resolves(null);
      });

      test('a NotFoundError is thrown', async () => {
        const func = () => invoiceAccountsAddressService.updateInvoiceAccountAddress(invoiceAccountAddressId, updates);
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.NotFoundError).to.be.true();
      });
    });

    experiment('when the end date is before the start date of the existing record', () => {
      beforeEach(async () => {
        invoiceAccountAddressesRepo.findOne.resolves({
          startDate: '2020-03-01'
        });
      });

      test('a ConflictingDataError is thrown', async () => {
        const func = () => invoiceAccountsAddressService.updateInvoiceAccountAddress(invoiceAccountAddressId, updates);
        const err = await expect(func()).to.reject();
        expect(err instanceof errors.ConflictingDataError).to.be.true();
      });
    });
  });
});
