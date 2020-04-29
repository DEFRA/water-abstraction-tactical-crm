'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const errors = require('../../../src/v2/lib/errors');
const mapErrorResponse = require('../../../src/v2/lib/map-error-response');

experiment('v2/lib/map-error-response', () => {
  experiment('.mapErrorResponse', () => {
    let mappedError;
    let validationDetails;

    experiment('for an EntityValidationError', () => {
      beforeEach(async () => {
        validationDetails = [
          'this is bad',
          'this is worse'
        ];
        const error = new errors.EntityValidationError('Bad data', validationDetails);
        mappedError = mapErrorResponse(error);
      });

      test('creates a 422 response code', async () => {
        expect(mappedError.output.payload.statusCode).to.equal(422);
        expect(mappedError.output.payload.error).to.equal('Unprocessable Entity');
      });

      test('includes the error message', async () => {
        expect(mappedError.output.payload.message).to.equal('Bad data');
      });

      test('includes the validation details', async () => {
        expect(mappedError.output.payload.validationDetails).to.equal(validationDetails);
      });
    });

    experiment('for an UniqueConstraintViolation', () => {
      beforeEach(async () => {
        const error = new errors.UniqueConstraintViolation('Non unique');
        mappedError = mapErrorResponse(error);
      });

      test('creates a 409 response code', async () => {
        expect(mappedError.output.payload.statusCode).to.equal(409);
        expect(mappedError.output.payload.error).to.equal('Conflict');
      });

      test('includes the error message', async () => {
        expect(mappedError.output.payload.message).to.equal('Non unique');
      });
    });

    experiment('for a ConflictingDataError', () => {
      beforeEach(async () => {
        const error = new errors.ConflictingDataError('This conflicts');
        mappedError = mapErrorResponse(error);
      });

      test('creates a 409 response code', async () => {
        expect(mappedError.output.payload.statusCode).to.equal(409);
        expect(mappedError.output.payload.error).to.equal('Conflict');
      });

      test('includes the error message', async () => {
        expect(mappedError.output.payload.message).to.equal('This conflicts');
      });
    });

    experiment('for an uncaught DB UniqueConstraintViolation', () => {
      beforeEach(async () => {
        const err = new Error();
        err.code = '23505';
        mappedError = mapErrorResponse(err);
      });

      test('creates a 409 response code', async () => {
        expect(mappedError.output.payload.statusCode).to.equal(409);
        expect(mappedError.output.payload.error).to.equal('Conflict');
      });
    });

    experiment('for an uncaught DB ForeignKeyConstraintViolation', () => {
      beforeEach(async () => {
        const err = new Error();
        err.code = '23503';
        mappedError = mapErrorResponse(err);
      });

      test('creates a 409 response code', async () => {
        expect(mappedError.output.payload.statusCode).to.equal(409);
        expect(mappedError.output.payload.error).to.equal('Conflict');
      });
    });
  });
});
