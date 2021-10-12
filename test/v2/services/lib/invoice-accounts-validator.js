'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const uuid = require('uuid/v4');
const invoiceAccountValidator = require('../../../../src/v2/services/lib/invoice-accounts-validator');

experiment('v2/services/lib/invoice-accounts-validator', () => {
  experiment('.validateInvoiceAccount', () => {
    let invoiceAccountData, companyId;

    beforeEach(async () => {
      companyId = uuid();
      invoiceAccountData = {
        companyId,
        invoiceAccountNumber: 'A12345678A',
        startDate: '2020-04-01',
        endDate: '2020-12-31'
      };
    });

    experiment('companyId', () => {
      test('is required', async () => {
        delete invoiceAccountData.companyId;

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('cannot equal a string that is not a guid', async () => {
        invoiceAccountData.companyId = 'test-id';

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.be.undefined();
        expect(value.companyId).to.equal(invoiceAccountData.companyId);
      });
    });

    experiment('invoiceAccountNumber', () => {
      test('is required', async () => {
        delete invoiceAccountData.invoiceAccountNumber;

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('cannot equal a string that does not fit expected pattern', async () => {
        invoiceAccountData.invoiceAccountNumber = '123abc';

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.be.undefined();
        expect(value.invoiceAccountNumber).to.equal(invoiceAccountData.invoiceAccountNumber);
      });
    });

    experiment('startDate', () => {
      test('is required', async () => {
        delete invoiceAccountData.startDate;

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('must be a valid date', async () => {
        invoiceAccountData.startDate = '2020-04-31';

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.be.undefined();
        expect(value.startDate).to.equal(new Date(invoiceAccountData.startDate));
      });
    });

    experiment('endDate', () => {
      test('is optional', async () => {
        delete invoiceAccountData.endDate;

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.be.undefined();
      });

      test('defaults to null', async () => {
        delete invoiceAccountData.endDate;

        const { value } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(value.endDate).to.equal(null);
      });

      test('must be a valid date', async () => {
        invoiceAccountData.endDate = '2020-12-00';

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('must be after the start date', async () => {
        invoiceAccountData.endDate = '2020-01-01';

        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.be.undefined();
        expect(value.endDate).to.equal(new Date(invoiceAccountData.endDate));
      });
    });

    experiment('isTest', () => {
      test('can be omitted', async () => {
        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.be.undefined();
      });

      test('defaults to false', async () => {
        const { value } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(value.isTest).to.equal(false);
      });

      test('can be set', async () => {
        invoiceAccountData.isTest = true;
        const { error, value } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.be.undefined();
        expect(value.isTest).to.equal(true);
      });

      test('cannt be a string', async () => {
        invoiceAccountData.isTest = 'yep';
        const { error } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccountData, 'invoiceAccount');
        expect(error).to.not.be.undefined();
      });
    });
  });

  experiment('.validateInvoiceAccountAddress', () => {
    let invoiceAccountData, invoiceAccountAddressData, invoiceAccountId, addressId;

    beforeEach(async () => {
      invoiceAccountId = uuid();
      addressId = uuid();
      invoiceAccountAddressData = {
        invoiceAccountId,
        addressId,
        startDate: '2020-04-01',
        endDate: '2020-12-31',
        agentCompanyId: null,
        contactId: null
      };

      const companyId = uuid();

      invoiceAccountData = {
        companyId,
        invoiceAccountNumber: 'A12345678A',
        startDate: '2020-04-01',
        endDate: '2020-12-31',
        company: {
          companyId
        }
      };
    });

    experiment('invoiceAccountId', () => {
      test('is required', async () => {
        delete invoiceAccountAddressData.invoiceAccountId;

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('cannot equal a string that is not a guid', async () => {
        invoiceAccountAddressData.invoiceAccountId = 'test-id';

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
        expect(value.invoiceAccountId).to.equal(invoiceAccountAddressData.invoiceAccountId);
      });
    });

    experiment('addressId', () => {
      test('is required', async () => {
        delete invoiceAccountAddressData.addressId;

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('cannot equal a string that is not a guid', async () => {
        invoiceAccountAddressData.addressId = 'test-id';

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
        expect(value.addressId).to.equal(invoiceAccountAddressData.addressId);
      });
    });

    experiment('startDate', () => {
      test('is required', async () => {
        delete invoiceAccountAddressData.startDate;

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('must be a valid date', async () => {
        invoiceAccountAddressData.startDate = '2020-04-31';

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
        expect(value.startDate).to.equal(new Date(invoiceAccountAddressData.startDate));
      });
    });

    experiment('endDate', () => {
      test('is optional', async () => {
        delete invoiceAccountAddressData.endDate;

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
      });

      test('defaults to null', async () => {
        delete invoiceAccountAddressData.endDate;

        const { value } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(value.endDate).to.equal(null);
      });

      test('must be a valid date', async () => {
        invoiceAccountAddressData.endDate = '2020-12-00';

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('must be after the start date', async () => {
        invoiceAccountAddressData.endDate = '2020-01-01';

        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
        expect(value.endDate).to.equal(new Date(invoiceAccountAddressData.endDate));
      });
    });

    experiment('isTest', () => {
      test('can be omitted', async () => {
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
      });

      test('defaults to false', async () => {
        const { value } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(value.isTest).to.equal(false);
      });

      test('can be set', async () => {
        invoiceAccountAddressData.isTest = true;
        const { error, value } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
        expect(value.isTest).to.equal(true);
      });

      test('cannt be a string', async () => {
        invoiceAccountAddressData.isTest = 'yep';
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });
    });

    experiment('agentCompanyId', () => {
      test('cannot be omitted', async () => {
        delete invoiceAccountAddressData.agentCompanyId;
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('can be set to a GUID', async () => {
        invoiceAccountAddressData.agentCompanyId = uuid();
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
      });

      test('can be set to null', async () => {
        invoiceAccountAddressData.agentCompanyId = null;
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
      });

      test('cannot be set to the same GUID as the company ID', async () => {
        invoiceAccountAddressData.agentCompanyId = invoiceAccountData.companyId;
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });
    });

    experiment('contactId', () => {
      test('cannot be omitted', async () => {
        delete invoiceAccountAddressData.contactId;
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.not.be.undefined();
      });

      test('can be set to a GUID', async () => {
        invoiceAccountAddressData.contactId = uuid();
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
      });

      test('can be set to null', async () => {
        invoiceAccountAddressData.contactId = null;
        const { error } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddressData, invoiceAccountData);
        expect(error).to.be.undefined();
      });
    });
  });
});
