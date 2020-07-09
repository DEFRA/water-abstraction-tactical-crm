'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const contactValidator = require('../../../../src/v2/modules/contacts/validator');

experiment('modules/contacts/validator', () => {
  experiment('.validate', () => {
    let contact;

    const testOptionalColumn = key => {
      test('is optional', async () => {
        delete contact[key];

        const { error } = contactValidator.validate(contact);
        expect(error).to.equal(null);
      });

      test('empty string is considered null', async () => {
        contact[key] = '';

        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value[key]).to.equal(null);
      });

      test('whitespace is considered null', async () => {
        contact[key] = '     ';

        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value[key]).to.equal(null);
      });

      test('is valid when present', async () => {
        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value[key]).to.equal(contact[key]);
      });

      test('is trimmed', async () => {
        contact[key] = '  Test   ';

        const { error, value } = contactValidator.validate(contact);

        expect(error).to.equal(null);
        expect(value[key]).to.equal('Test');
      });
    };

    const testRequiredColumn = key => {
      test('is required', async () => {
        delete contact[key];

        const { error } = contactValidator.validate(contact);

        expect(error).to.not.equal(null);
        expect(error.details.map(detail => detail.message))
          .to
          .include(`"${key}" is required`);
      });

      test('empty string is considered null', async () => {
        contact[key] = '';

        const { error } = contactValidator.validate(contact);

        expect(error).to.not.equal(null);
        expect(error.details.map(detail => detail.message))
          .to
          .include(`"${key}" is not allowed to be empty`);
      });

      test('white space is considered null', async () => {
        contact[key] = '    ';

        const { error } = contactValidator.validate(contact);

        expect(error).to.not.equal(null);
        expect(error.details.map(detail => detail.message))
          .to
          .include(`"${key}" is not allowed to be empty`);
      });

      test('is valid when present', async () => {
        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value[key]).to.equal(contact[key]);
      });

      test('is trimmed', async () => {
        contact[key] = '  Test   ';

        const { error, value } = contactValidator.validate(contact);

        expect(error).to.equal(null);
        expect(value[key]).to.equal('Test');
      });
    };

    const testIsTestFlag = () => {
      test('can be omitted', async () => {
        delete contact.isTest;
        const { error } = contactValidator.validate(contact);
        expect(error).to.equal(null);
      });

      test('defaults to false', async () => {
        delete contact.isTest;
        const { value } = contactValidator.validate(contact);
        expect(value.isTest).to.equal(false);
      });

      test('can be set', async () => {
        contact.isTest = true;
        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value.isTest).to.equal(true);
      });

      test('cannot be a string', async () => {
        contact.isTest = 'yep';
        const { error } = contactValidator.validate(contact);
        expect(error).to.not.equal(null);
      });
    };

    const testDataSourceColumn = () => {
      test('can be omitted', async () => {
        delete contact.dataSource;
        const { error } = contactValidator.validate(contact);
        expect(error).to.equal(null);
      });

      test('defaults to wrls', async () => {
        delete contact.dataSource;
        const { value } = contactValidator.validate(contact);
        expect(value.dataSource).to.equal('wrls');
      });

      test('can be set to a valid value', async () => {
        contact.dataSource = 'nald';
        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value.dataSource).to.equal('nald');
      });

      test('cannot be set to a non-valid value', async () => {
        contact.dataSource = 'not-a-data-source';
        const { error } = contactValidator.validate(contact);
        expect(error).to.not.equal(null);
      });
    };

    const testContactType = () => {
      test('is valid when it is "person"', () => {
        contact = {
          type: 'person',
          firstName: 'First',
          lastName: 'Last'
        };

        const { error } = contactValidator.validate(contact);
        expect(error).to.equal(null);
      });

      test('is valid when it is "department"', () => {
        contact = {
          type: 'department',
          department: 'some department'
        };

        const { error } = contactValidator.validate(contact);
        expect(error).to.equal(null);
      });

      test('cannot be an unexpected value', () => {
        contact = {
          type: 'individual',
          firstName: 'First',
          lastName: 'Last'
        };

        const { error } = contactValidator.validate(contact);
        expect(error).to.not.equal(null);
      });
    };

    const testTitle = () => {
      test('is optional', async () => {
        delete contact.title;

        const { error } = contactValidator.validate(contact);
        expect(error).to.equal(null);
      });

      test('empty string is considered null', async () => {
        contact.title = '';

        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value.salutation).to.equal(null);
      });

      test('whitespace is considered null', async () => {
        contact.title = '     ';

        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value.salutation).to.equal(null);
      });

      test('is renamed to salutation', async () => {
        const { error, value } = contactValidator.validate(contact);
        expect(error).to.equal(null);
        expect(value.salutation).to.equal(contact.title);
      });

      test('is trimmed', async () => {
        contact.title = '  Test   ';

        const { error, value } = contactValidator.validate(contact);

        expect(error).to.equal(null);
        expect(value.salutation).to.equal('Test');
      });
    };

    experiment('type', () => {
      testContactType();
    });

    experiment('when the contact type is a person', () => {
      beforeEach(async () => {
        contact = {
          type: 'person',
          title: 'Dr',
          firstName: 'First',
          middleInitials: 'M',
          lastName: 'Last',
          suffix: 'MP',
          department: 'Water resources',
          isTest: true,
          dataSource: 'wrls'
        };
      });

      experiment('title', () => {
        testTitle();
      });

      experiment('firstName', () => {
        testRequiredColumn('firstName');
      });

      experiment('middleInitials', () => {
        testOptionalColumn('middleInitials');
      });

      experiment('lastName', () => {
        testRequiredColumn('lastName');
      });

      experiment('isTest', () => {
        testIsTestFlag();
      });

      experiment('suffix', () => {
        testOptionalColumn('suffix');
      });

      experiment('dataSource', () => {
        testDataSourceColumn();
      });
    });

    experiment('when the contact type is a department', () => {
      beforeEach(async () => {
        contact = {
          type: 'department',
          department: 'Accounts department',
          isTest: true,
          dataSource: 'wrls'
        };
      });

      experiment('department', () => {
        testRequiredColumn('department');
      });

      experiment('isTest', () => {
        testIsTestFlag();
      });

      experiment('dataSource', () => {
        testDataSourceColumn();
      });
    });
  });
});
