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
    experiment('address1', () => {
      test('is required', async () => {
        delete fullAddress.address1;

        const { error } = addressValidator.validate(fullAddress);
        expect(error).to.not.equal(null);
      });

      test('cannot equal an empty string', async () => {
        fullAddress.address1 = '';

        const { error } = addressValidator.validate(fullAddress);
        expect(error).to.not.equal(null);
      });

      test('cannot equal white space', async () => {
        fullAddress.address1 = '    ';

        const { error } = addressValidator.validate(fullAddress);
        expect(error).to.not.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = addressValidator.validate(fullAddress);
        expect(error).to.equal(null);
        expect(value.address1).to.equal(fullAddress.address1);
      });
    });

    experiment('address2, address3, address4, county', () => {
      const keys = ['address2', 'address3', 'address4', 'county'];

      keys.forEach(key => {
        test(`${key}: is optional`, async () => {
          delete fullAddress[key];

          const { error, value } = addressValidator.validate(fullAddress);
          expect(error).to.equal(null);
          expect(value[key]).to.equal(null);
        });

        test(`${key}: an empty string resolves to null`, async () => {
          fullAddress[key] = '';

          const { error, value } = addressValidator.validate(fullAddress);
          expect(error).to.equal(null);
          expect(value[key]).to.equal(null);
        });

        test(`${key}: white space resolves to null`, async () => {
          fullAddress[key] = '    ';

          const { error, value } = addressValidator.validate(fullAddress);
          expect(error).to.equal(null);
          expect(value[key]).to.equal(null);
        });

        test(`${key}: is valid when present`, async () => {
          const { error, value } = addressValidator.validate(fullAddress);
          expect(error).to.equal(null);
          expect(value[key]).to.equal(fullAddress[key]);
        });
      });
    });

    experiment('town', () => {
      test('is required', async () => {
        delete fullAddress.town;

        const { error } = addressValidator.validate(fullAddress);
        expect(error).to.not.equal(null);
      });

      test('cannot equal an empty string', async () => {
        fullAddress.town = '';

        const { error } = addressValidator.validate(fullAddress);
        expect(error).to.not.equal(null);
      });

      test('cannot equal white space', async () => {
        fullAddress.town = '    ';

        const { error } = addressValidator.validate(fullAddress);
        expect(error).to.not.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = addressValidator.validate(fullAddress);
        expect(error).to.equal(null);
        expect(value.town).to.equal(fullAddress.town);
      });

      test('is trimmed and valid when present with extra whitespace', async () => {
        fullAddress.town = '   new town   ';
        const { error, value } = addressValidator.validate(fullAddress);
        expect(error).to.equal(null);
        expect(value.town).to.equal('new town');
      });
    });
  });

  experiment('country', () => {
    test('is required', async () => {
      delete fullAddress.country;

      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.not.equal(null);
    });

    test('cannot equal an empty string', async () => {
      fullAddress.country = '';

      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.not.equal(null);
    });

    test('cannot equal white space', async () => {
      fullAddress.country = '    ';

      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.not.equal(null);
    });

    test('is valid when present', async () => {
      const { error, value } = addressValidator.validate(fullAddress);
      expect(error).to.equal(null);
      expect(value.country).to.equal(fullAddress.country);
    });

    test('is trimmed and valid when present with extra whitespace', async () => {
      fullAddress.country = '   new country   ';
      const { error, value } = addressValidator.validate(fullAddress);
      expect(error).to.equal(null);
      expect(value.country).to.equal('new country');
    });

    test('removes full stops', async () => {
      fullAddress.country = 'U.K.';
      const { error, value } = addressValidator.validate(fullAddress);
      expect(error).to.equal(null);
      expect(value.country).to.equal('UK');
    });
  });

  experiment('uprn', () => {
    test('is optional', async () => {
      delete fullAddress.uprn;

      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.equal(null);
    });

    test('cannot be a string', async () => {
      fullAddress.uprn = 'abc';

      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.not.equal(null);
    });

    test('cannot equal white space', async () => {
      fullAddress.uprn = '    ';

      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.not.equal(null);
    });

    test('is valid when present', async () => {
      const { error, value } = addressValidator.validate(fullAddress);
      expect(error).to.equal(null);
      expect(value.uprn).to.equal(fullAddress.uprn);
    });
  });

  experiment('postcode', () => {
    experiment('when the country is not part of the UK', () => {
      beforeEach(async () => {
        fullAddress.country = 'France';
      });

      test('the postcode can be omitted', async () => {
        delete fullAddress.postcode;
        const { error, value } = addressValidator.validate(fullAddress);
        expect(error).to.equal(null);
        expect(value.postcode).to.equal(null);
      });

      test('a postcode can be supplied', async () => {
        fullAddress.postcode = 'TEST';
        const { error, value } = addressValidator.validate(fullAddress);
        expect(error).to.equal(null);
        expect(value.postcode).to.equal('TEST');
      });

      test('an empty postcode resolves to null', async () => {
        fullAddress.postcode = '';
        const { error, value } = addressValidator.validate(fullAddress);
        expect(error).to.equal(null);
        expect(value.postcode).to.equal(null);
      });

      test('a whitespace postcode resolves to null', async () => {
        fullAddress.postcode = '    ';
        const { error, value } = addressValidator.validate(fullAddress);
        expect(error).to.equal(null);
        expect(value.postcode).to.equal(null);
      });
    });

    const countries = [
      'United Kingdom',
      'ENGLAND',
      'wales',
      'Scotland',
      'Northern IRELAND',
      'UK',
      'U.K',
      'u.k.'
    ];

    countries.forEach(country => {
      experiment(`when the country is ${country}`, async () => {
        beforeEach(async () => {
          fullAddress.country = country;
        });
        test('the postcode is mandatory', async () => {
          delete fullAddress.postcode;
          const { error } = addressValidator.validate(fullAddress);
          expect(error).to.not.equal(null);
        });

        test('an invalid postcode is rejected', async () => {
          fullAddress.postcode = 'nope';
          const { error } = addressValidator.validate(fullAddress);
          expect(error).to.not.equal(null);
        });

        test('a valid postcode is trimmed', async () => {
          fullAddress.postcode = 'BS98 1TL';
          const { error, value } = addressValidator.validate(fullAddress);
          expect(error).to.equal(null);
          expect(value.postcode).to.equal('BS98 1TL');
        });

        test('a postcode can be without spaces', async () => {
          fullAddress.postcode = 'BS981TL';
          const { error, value } = addressValidator.validate(fullAddress);
          expect(error).to.equal(null);
          expect(value.postcode).to.equal('BS98 1TL');
        });

        test('a postcode will be uppercased', async () => {
          fullAddress.postcode = 'bs98 1TL';
          const { error, value } = addressValidator.validate(fullAddress);
          expect(error).to.equal(null);
          expect(value.postcode).to.equal('BS98 1TL');
        });
      });
    });
  });

  experiment('isTest', () => {
    test('can be omitted', async () => {
      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.equal(null);
    });

    test('defaults to false', async () => {
      const { value } = addressValidator.validate(fullAddress);
      expect(value.isTest).to.equal(false);
    });

    test('can be set', async () => {
      fullAddress.isTest = true;
      const { error, value } = addressValidator.validate(fullAddress);
      expect(error).to.equal(null);
      expect(value.isTest).to.equal(true);
    });

    test('cannt be a string', async () => {
      fullAddress.isTest = 'yep';
      const { error } = addressValidator.validate(fullAddress);
      expect(error).to.not.equal(null);
    });
  });
});
