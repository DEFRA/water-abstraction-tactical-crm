'use strict';

const Boom = require('@hapi/boom');

const transformEntityValidationError = error => {
  const boomError = Boom.badData(error.message);
  boomError.output.payload.validationDetails = error.validationDetails;
  return boomError;
};

const transformConflict = error => Boom.conflict(error.message);

const commandMap = new Map();
commandMap.set('ConflictingDataError', transformConflict);
commandMap.set('EntityValidationError', transformEntityValidationError);
commandMap.set('ForeignKeyConstraintViolation', transformConflict);
commandMap.set('UniqueConstraintViolation', transformConflict);

/**
 * Maps a service error to a Boom error for providing an HTTP response
 * If the error is unknown, it is rethrown
 * @param {Error}
 * @return {Error} Boom error
 */
const mapErrorResponse = error => {
  error.name = error.code === '23503' ? 'ForeignKeyConstraintViolation' : error.name;
  error.name = error.code === '23505' ? 'UniqueConstraintViolation' : error.name;
  const func = commandMap.get(error.name);

  if (func) {
    return func(error);
  }
  throw error;
};

const mapValidationErrorDetails = error => error.details.map(detail => detail.message);

exports.mapErrorResponse = mapErrorResponse;
exports.mapValidationErrorDetails = mapValidationErrorDetails;
