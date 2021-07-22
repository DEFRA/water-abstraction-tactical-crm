'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const addressValidator = require('../../../../src/v2/modules/addresses/validator');

experiment('modules/addresses/validator', () => {
  let fullAddress;

  beforeEach(async () => {
    fullAddress = {
      address1: 'test-1',
      address2: 'test-2',
      address3: 'test-3',
      address4: 'test-4',
      town: 'test-town',
      county: 'test-county',
      country: 'test-country',
      postcode: 'E20 3EL',
      uprn: 1234
    };
  });

  experiment('.validate', () => {
    test('validates a valid address', async () => {
      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.be.null();
    });

    test('errors for an invalid address', async () => {
      fullAddress.country = 'United Kingdom';
      fullAddress.postcode = 'XXX XXX';
      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.not.be.null();
    });
  });
});
