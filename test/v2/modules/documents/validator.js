'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const validator = require('../../../../src/v2/modules/documents/validator');

experiment('modules/documents/validator', () => {
  let document;

  beforeEach(async () => {
    document = {
      regime: 'water',
      documentType: 'abstraction_licence',
      versionNumber: 100,
      documentRef: 'doc-ref',
      status: 'current',
      startDate: '2001-01-18',
      endDate: '2010-01-17',
      isTest: true
    };
  });

  experiment('.validate', () => {
    experiment('regime', () => {
      test('is required', async () => {
        delete document.regime;
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('cannot equal an empty string', async () => {
        document.regime = '';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('has to equal water', async () => {
        document.regime = 'nothing';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('has to equal water', async () => {
        document.regime = 'water';
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });
    });

    experiment('documentType', () => {
      test('is required', async () => {
        delete document.documentType;
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('cannot equal an empty string', async () => {
        document.documentType = '';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('has to equal abstraction_licence', async () => {
        document.documentType = 'nothing';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('has to equal abstraction_licence', async () => {
        document.documentType = 'abstraction_licence';
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });
    });

    experiment('versionNumber', () => {
      test('is required', async () => {
        delete document.versionNumber;
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('cannot equal an empty string', async () => {
        document.versionNumber = '';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('cannot equal a string', async () => {
        document.versionNumber = '100';
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });

      test('has to equal a number', async () => {
        document.versionNumber = 100;
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });
    });

    experiment('documentRef', () => {
      test('is required', async () => {
        delete document.documentRef;
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('cannot equal an empty string', async () => {
        document.documentRef = '';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('has to equal abstraction_licence', async () => {
        document.documentRef = 'doc-ref';
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });
    });

    experiment('status', () => {
      test('is required', async () => {
        delete document.status;
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('cannot equal an empty string', async () => {
        document.status = '';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('has to equal a valid status', async () => {
        document.status = 'nothing';
        const { error } = validator.validate(document);
        expect(error).to.not.equal(null);
      });

      test('has to equal  a valid status', async () => {
        document.status = 'current';
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });

      test('has to equal a valid status', async () => {
        document.status = 'draft';
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });

      test('has to equal a valid status', async () => {
        document.status = 'superseded';
        const { error } = validator.validate(document);
        expect(error).to.equal(null);
      });
    });
  });

  experiment('isTest', () => {
    test('can be omitted', async () => {
      delete document.isTest;
      const { error } = validator.validate(document);
      expect(error).to.equal(null);
    });

    test('defaults to false', async () => {
      delete document.isTest;
      const { value } = validator.validate(document);
      expect(value.isTest).to.equal(false);
    });

    test('can be set', async () => {
      const { error, value } = validator.validate(document);
      expect(error).to.equal(null);
      expect(value.isTest).to.equal(true);
    });

    test('cannt be a string', async () => {
      document.isTest = 'yep';
      const { error } = validator.validate(document);
      expect(error).to.not.equal(null);
    });
  });
});
