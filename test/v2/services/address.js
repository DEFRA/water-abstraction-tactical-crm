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

experiment('v2/services/address', () => {
  beforeEach(async () => {
    sandbox.stub(addressRepo, 'create').resolves();
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
        expect(err.validationDetails).to.include('"address3" is required');
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
          address2: 'one',
          town: 'town',
          county: 'county',
          country: 'france'
        });
      });

      test('includes the saved address in the response', async () => {
        expect(result.addressId).to.equal('test-address-id');
      });
    });
  });
});
