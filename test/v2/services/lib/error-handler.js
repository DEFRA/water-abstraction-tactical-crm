'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const errorHandler = require('../../../../src/v2/services/lib/error-handler');

experiment('./src/v2/services/lib/error-handler', () => {
  let mappedError;

  const getError = async (errorCode) => {
    const error = Error('pretty bad');

    error.code = errorCode;
    try {
      errorHandler(error);
    } catch (err) {
      const mappedError = err;
      return mappedError;
    }
  };

  test('returns a unique constraint error', async () => {
    mappedError = await getError(23505);
    expect(mappedError.name).to.equal('UniqueConstraintViolation');
  });
  test('returns a unique constraint error', async () => {
    mappedError = await getError(23503);
    expect(mappedError.name).to.equal('ForeignKeyConstraintViolation');
  });
});
