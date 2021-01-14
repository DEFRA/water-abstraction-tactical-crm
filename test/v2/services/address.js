'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const addressRepo = require('../../../src/v2/connectors/repository/addresses');
const addressService = require('../../../src/v2/services/address');
const { UniqueConstraintViolation } = require('../../../src/v2/lib/errors');

experiment('v2/services/address', () => {
  beforeEach(async () => {
    sandbox.stub(addressRepo, 'create').resolves();
    sandbox.stub(addressRepo, 'findOne').resolves();
    sandbox.stub(addressRepo, 'deleteOne').resolves();
    sandbox.stub(addressRepo, 'findByUprn').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.createAddress', () => {
    experiment('for an invalid address', () => {
      let err;

      beforeEach(async () => {
        try {
          await addressService.createAddress({});
        } catch (error) {
          err = error;
        }
      });

      test('does not create the address at the database', async () => {
        expect(addressRepo.create.called).to.equal(false);
      });

      test('throws an error containing the validation messages', async () => {
        expect(err.message).to.equal('Address not valid');
        expect(err.validationDetails).to.include('"addressLine3" is required');
        expect(err.validationDetails).to.include('"town" is required');
        expect(err.validationDetails).to.include('"postcode" is required');
        expect(err.validationDetails).to.include('"country" is required');
      });
    });

    experiment('for a valid address', () => {
      let result;

      beforeEach(async () => {
        addressRepo.create.resolves({
          addressId: 'test-address-id'
        });

        result = await addressService.createAddress({
          address1: null,
          address2: 'one',
          address3: null,
          address4: null,
          town: 'town',
          county: 'county',
          country: 'france',
          postcode: null
        });
      });

      test('includes the saved address in the response', async () => {
        expect(result.addressId).to.equal('test-address-id');
      });
    });

    experiment('when address with same uprn already exists', () => {
      let result, error;

      beforeEach(async () => {
        error = new Error('oops!');
        error.code = '23505';
        error.constraint = 'unique_address_uprn';
        error.detail = 'unique constraint violation on uprn';
        addressRepo.create.throws(error);
        addressRepo.findByUprn.resolves({
          addressId: 'test-address-id'
        });
      });

      test('throws a UniqueConstraintValidation error', async () => {
        const func = () => addressService.createAddress({
          address1: null,
          address2: 'one',
          address3: null,
          address4: null,
          town: 'town',
          county: 'county',
          country: 'france',
          postcode: null
        });

        result = await expect(func()).to.reject();
        console.log(result);
        expect(result instanceof UniqueConstraintViolation).to.be.true();
        expect(result.existingEntity).to.be.an.object();
      });
    });

    experiment('when an unexpected error occurs', () => {
      let error;

      beforeEach(async () => {
        error = new Error('oops!');
        addressRepo.create.throws(error);
      });

      test('returns the error', async () => {
        try {
          await addressService.createAddress({
            address1: null,
            address2: 'one',
            address3: null,
            address4: null,
            town: 'town',
            county: 'county',
            country: 'france',
            postcode: null
          });
        } catch (err) {
          expect(err).to.equal(error);
        }
      });
    });
  });

  experiment('.getAddress', () => {
    test('calls the findOne repo method', async () => {
      await addressService.getAddress('test-address-id');
      expect(addressRepo.findOne.calledWith('test-address-id')).to.be.true();
    });
  });

  experiment('.deleteAddress', () => {
    test('calls the deleteOne repo method', async () => {
      await addressService.deleteAddress('test-address-id');
      expect(addressRepo.deleteOne.calledWith('test-address-id')).to.be.true();
    });
  });
});
