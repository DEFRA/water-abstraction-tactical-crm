'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const uuid = require('uuid/v4');
const companyId = uuid();
const invoiceAccountValidator = require('../../../../src/v2/modules/invoice-accounts/validator');

experiment('v2/modules/invoice-accounts/validator', () => {
  let invoiceAccountData;

  beforeEach(async () => {
    invoiceAccountData = {
      companyId,
      invoiceAccountNumber: 'A12345678A',
      startDate: '2020-04-01',
      endDate: '2020-12-31'
    };
  });

  experiment('.validate', () => {
    experiment('companyId', () => {
      test('is required', async () => {
        delete invoiceAccountData.companyId;

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('cannot equal a string that is not a guid', async () => {
        invoiceAccountData.companyId = 'test-id';

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.equal(null);
        expect(value.companyId).to.equal(invoiceAccountData.companyId);
      });
    });

    experiment('invoiceAccountNumber', () => {
      test('is required', async () => {
        delete invoiceAccountData.invoiceAccountNumber;

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('cannot equal a string that does not fit expected pattern', async () => {
        invoiceAccountData.invoiceAccountNumber = '123abc';

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.equal(null);
        expect(value.invoiceAccountNumber).to.equal(invoiceAccountData.invoiceAccountNumber);
      });
    });

    experiment('startDate', () => {
      test('is required', async () => {
        delete invoiceAccountData.startDate;

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('must be a valid date', async () => {
        invoiceAccountData.startDate = '2020-04-31';

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.equal(null);
        expect(value.startDate).to.equal(new Date(invoiceAccountData.startDate));
      });
    });

    experiment('endDate', () => {
      test('is optional', async () => {
        delete invoiceAccountData.endDate;

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.equal(null);
      });

      test('defaults to null', async () => {
        delete invoiceAccountData.endDate;

        const { value } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(value.endDate).to.equal(null);
      });

      test('must be a valid date', async () => {
        invoiceAccountData.endDate = '2020-12-00';

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('must be after the start date', async () => {
        invoiceAccountData.endDate = '2020-01-01';

        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.equal(null);
        expect(value.endDate).to.equal(new Date(invoiceAccountData.endDate));
      });
    });

    experiment('isTest', () => {
      test('can be omitted', async () => {
        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.equal(null);
      });

      test('defaults to false', async () => {
        const { value } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(value.isTest).to.equal(false);
      });

      test('can be set', async () => {
        invoiceAccountData.isTest = true;
        const { error, value } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.equal(null);
        expect(value.isTest).to.equal(true);
      });

      test('cannt be a string', async () => {
        invoiceAccountData.isTest = 'yep';
        const { error } = invoiceAccountValidator.validate(invoiceAccountData);
        expect(error).to.not.equal(null);
      });
    });
  });
});
