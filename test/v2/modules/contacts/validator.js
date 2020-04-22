'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const contactValidator = require('../../../../src/v2/modules/contacts/validator');

experiment('modules/contacts/validator', () => {
  let fullContact;

  beforeEach(async () => {
    fullContact = {
      salutation: 'Dr',
      firstName: 'First',
      initials: 'I',
      lastName: 'Last',
      middleName: 'Mid',
      isTest: true
    };
  });

  experiment('.validate', () => {
    experiment('salutation', () => {
      test('is optional', async () => {
        delete fullContact.salutation;

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
      });

      test('empty string is considered undefined', async () => {
        fullContact.salutation = '';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.salutation).to.equal(undefined);
      });

      test('whitespace is considered undefined', async () => {
        fullContact.salutation = '     ';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.salutation).to.equal(undefined);
      });

      test('is valid when present', async () => {
        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.salutation).to.equal(fullContact.salutation);
      });

      test('is trimmed', async () => {
        fullContact.salutation = '  Mrs   ';

        const { error, value } = contactValidator.validate(fullContact);

        expect(error).to.equal(null);
        expect(value.salutation).to.equal('Mrs');
      });
    });

    experiment('firstName', () => {
      test('is optional if the intitals are present', async () => {
        delete fullContact.firstName;

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
      });

      test('is required if the intitals are empty', async () => {
        delete fullContact.initials;
        delete fullContact.firstName;

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.not.equal(null);
        expect(error.details.map(detail => detail.message))
          .to
          .include('"value" must contain at least one of [firstName, initials]');
      });

      test('empty string is considered undefined', async () => {
        fullContact.firstName = '';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.firstName).to.be.undefined();
      });

      test('white space is considered undefined', async () => {
        fullContact.firstName = '    ';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.firstName).to.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.firstName).to.equal(fullContact.firstName);
      });

      test('is trimmed', async () => {
        fullContact.firstName = '  First   ';

        const { error, value } = contactValidator.validate(fullContact);

        expect(error).to.equal(null);
        expect(value.firstName).to.equal('First');
      });
    });

    experiment('initials', () => {
      test('is optional if the firstName is present', async () => {
        delete fullContact.initials;

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
      });

      test('is required if the firstName is undefined', async () => {
        delete fullContact.initials;
        delete fullContact.firstName;

        const { error } = contactValidator.validate(fullContact);
        expect(error.details.map(detail => detail.message))
          .to
          .include('"value" must contain at least one of [firstName, initials]');
      });

      test('is required if the firstName is empty text', async () => {
        delete fullContact.initials;
        fullContact.firstName = '  ';

        const { error } = contactValidator.validate(fullContact);
        expect(error.details.map(detail => detail.message))
          .to
          .include('"value" must contain at least one of [firstName, initials]');
      });

      test('empty string is considered to be undefined', async () => {
        fullContact.initials = '';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.initials).to.be.undefined();
      });

      test('white space is considered to be undefined', async () => {
        fullContact.initials = '      ';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.initials).to.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.initials).to.equal(fullContact.initials);
      });

      test('is trimmed', async () => {
        fullContact.initials = '  I   ';

        const { error, value } = contactValidator.validate(fullContact);

        expect(error).to.equal(null);
        expect(value.initials).to.equal('I');
      });
    });

    experiment('lastName', () => {
      test('is required', async () => {
        delete fullContact.lastName;

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.not.equal(null);
      });

      test('cannot be empty string', async () => {
        fullContact.lastName = '';

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.not.equal(null);
      });

      test('cannot be white space', async () => {
        fullContact.lastName = '    ';

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.not.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.lastName).to.equal(fullContact.lastName);
      });

      test('is trimmed', async () => {
        fullContact.lastName = '  Last   ';

        const { error, value } = contactValidator.validate(fullContact);

        expect(error).to.equal(null);
        expect(value.lastName).to.equal('Last');
      });
    });

    experiment('middleName', () => {
      test('is optional', async () => {
        delete fullContact.middleName;

        const { error } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
      });

      test('empty string is considered undefined', async () => {
        fullContact.middleName = '';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.middleName).to.be.undefined();
      });

      test('white space is considered undefined', async () => {
        fullContact.middleName = '     ';

        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.middleName).to.be.undefined();
      });

      test('is valid when present', async () => {
        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.middleName).to.equal(fullContact.middleName);
      });

      test('is trimmed', async () => {
        fullContact.middleName = '  Mid   ';

        const { error, value } = contactValidator.validate(fullContact);

        expect(error).to.equal(null);
        expect(value.middleName).to.equal('Mid');
      });
    });

    experiment('isTest', () => {
      test('can be omitted', async () => {
        delete fullContact.isTest;
        const { error } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
      });

      test('defaults to false', async () => {
        delete fullContact.isTest;
        const { value } = contactValidator.validate(fullContact);
        expect(value.isTest).to.equal(false);
      });

      test('can be set', async () => {
        fullContact.isTest = true;
        const { error, value } = contactValidator.validate(fullContact);
        expect(error).to.equal(null);
        expect(value.isTest).to.equal(true);
      });

      test('cannot be a string', async () => {
        fullContact.isTest = 'yep';
        const { error } = contactValidator.validate(fullContact);
        expect(error).to.not.equal(null);
      });
    });
  });
});
