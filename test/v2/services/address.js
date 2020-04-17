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
      let result;

      beforeEach(async () => {
        result = await addressService.createAddress({});
      });

      test('does not create the address at the database', async () => {
        expect(addressRepo.create.called).to.equal(false);
      });

      test('returns an error containing the validation messages', async () => {
        expect(result.error.message).to.equal('Address not valid');
        expect(result.error.details).to.include('"address1" is required');
      });
    });

    experiment('for a valid address', () => {
      let result;

      beforeEach(async () => {
        addressRepo.create.resolves({
          addressId: 'test-address-id'
        });

        result = await addressService.createAddress({
          address1: 'one',
          town: 'town',
          county: 'county',
          country: 'france'
        });
      });

      test('includes the saved address in the response', async () => {
        expect(result.address.addressId).to.equal('test-address-id');
      });

      test('the result does not have an error', async () => {
        expect(result.error).to.equal(null);
      });
    });
  });
});
