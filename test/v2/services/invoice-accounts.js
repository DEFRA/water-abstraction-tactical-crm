'use strict';

const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const uuid = require('uuid/v4');

const invoiceAccountsService = require('../../../src/v2/services/invoice-accounts');
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
    sandbox.stub(invoiceAccountAddressesRepo, 'findAll').resolves([{ startDate: '2018-05-03', endDate: '2020-03-31' }]);
    sandbox.stub(invoiceAccountAddressesRepo, 'create');
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
  });

  afterEach(() => sandbox.restore());

  experiment('.createInvoiceAccount', () => {
    experiment('when the invoice account data is invalid', () => {
      let invoiceAccount;
      beforeEach(() => {
        invoiceAccount = {
          companyId: 'not-valid',
          invoiceAccountNumber: '123abc',
          startDate: '2020-04-01'
        };
      });
      test('any EntityValidationError is thrown', async () => {
        const err = await expect(invoiceAccountsService.createInvoiceAccount(invoiceAccount))
          .to.reject(errors.EntityValidationError, 'Invoice account not valid');

        expect(err.validationDetails).to.be.an.array();
      });

      test('the invoice account is not saved', async () => {
        expect(invoiceAccountsRepo.create.called).to.equal(false);
      });
    });

    experiment('when the invoice account data is valid', async () => {
      let result;
      let invoiceAccount;

      beforeEach(async () => {
        invoiceAccount = {
          companyId: uuid(),
          invoiceAccountNumber: 'A12345678A',
          startDate: '2020-04-01'
        };

        invoiceAccountsRepo.create.resolves({
          invoiceAccountId: 'test-id',
          ...invoiceAccount
        });

        result = await invoiceAccountsService.createInvoiceAccount(invoiceAccount);
      });

      test('the invoice account is saved via the repository', async () => {
        expect(invoiceAccountsRepo.create.called).to.equal(true);
      });

      test('the saved invoice account is returned', async () => {
        expect(result.invoiceAccountId).to.equal('test-id');
      });
    });
  });

  experiment('.getInvoiceAccount', () => {
    test('returns the result from the repo', async () => {
      const invoiceAccountId = uuid();
      const invoiceAccount = { invoiceAccountId };
      invoiceAccountsRepo.findOne.resolves(invoiceAccount);

      const result = await invoiceAccountsService.getInvoiceAccount(invoiceAccountId);

      expect(invoiceAccountsRepo.findOne.calledWith(invoiceAccountId)).to.equal(true);
      expect(result).to.equal(invoiceAccount);
    });
  });

  experiment('.getInvoiceAccountsByIds', () => {
    let invoiceAccountIds, repositoryResponse, result;

    beforeEach(async () => {
      invoiceAccountIds = [uuid(), uuid()];
      repositoryResponse = [
        createInvoiceAccount(invoiceAccountIds[0]),
        createInvoiceAccount(invoiceAccountIds[1])
      ];
      invoiceAccountsRepo.findWithCurrentAddress.resolves(repositoryResponse);
      result = await invoiceAccountsService.getInvoiceAccountsByIds(invoiceAccountIds);
    });

    test('has the expected invoice account data', async () => {
      expect(result[0].invoiceAccountId).to.equal(repositoryResponse[0].invoiceAccountId);
      expect(result[1].invoiceAccountId).to.equal(repositoryResponse[1].invoiceAccountId);
    });

    test('includes company data', async () => {
      expect(result[0].company).to.equal(repositoryResponse[0].company);
      expect(result[1].company).to.equal(repositoryResponse[1].company);
    });

    test('includes the current address only', async () => {
      expect(result[0].address).to.equal(repositoryResponse[0].invoiceAccountAddresses[1].address);
      expect(result[1].address).to.equal(repositoryResponse[1].invoiceAccountAddresses[1].address);
    });
  });

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
        const err = await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
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
          const err = await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified address ${invoiceAccountAddress.addressId} is not in company ${companyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('and the posted address ID belongs to the licence holder company', () => {
        test('no error is thrown', async () => {
          const func = () => invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
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
          const err = await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified contact ${invoiceAccountAddress.contactId} is not in the company ${companyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('and the posted contact ID belongs to the licence holder company', () => {
        beforeEach(async () => {
          invoiceAccountAddress.contactId = uuid();
        });

        test('no error is thrown', async () => {
          test('no error is thrown', async () => {
            const func = () => invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
            expect(func()).to.not.reject();
          });
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
          const err = await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified address ${invoiceAccountAddress.addressId} is not in company ${invoiceAccountAddress.agentCompanyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
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
          await invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
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
          const err = await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(err.message).to.equal(`Specified contact ${invoiceAccountAddress.contactId} is not in the company ${invoiceAccountAddress.agentCompanyId}`);
        });

        test('the invoice account address is not saved', async () => {
          await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject(errors.ConflictingDataError);
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('and the posted contact ID belongs to the agent company', () => {
        beforeEach(async () => {
          contactsRepo.findOneWithCompanies.resolves({
            companyContacts: [{
              companyId: invoiceAccountAddress.agentCompanyId
            }]
          });
        });

        test('no error is thrown', async () => {
          test('no error is thrown', async () => {
            const func = () => invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
            expect(func()).to.not.reject();
          });
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
        await invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
        expect(
          invoiceAccountAddressesRepo.findAll.calledWith(invoiceAccountId)
        ).to.be.true();
      });

      experiment('when there are no date conflicts', async () => {
        beforeEach(async () => {
          result = await invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
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
          const err = await expect(invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress))
            .to.reject();

          expect(err.name).to.equal('ConflictingDataError');
          expect(err.message).to.equal('Existing invoice account address exists for date range');
        });

        test('the invoice account address is not saved', async () => {
          try {
            await invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
          } catch (err) {
          }
          expect(invoiceAccountAddressesRepo.create.called).to.equal(false);
        });
      });

      experiment('when there are no address for the invoice account', async () => {
        beforeEach(async () => {
          invoiceAccountAddressesRepo.findAll.resolves([]);

          result = await invoiceAccountsService.createInvoiceAccountAddress(invoiceAccountAddress);
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
});
