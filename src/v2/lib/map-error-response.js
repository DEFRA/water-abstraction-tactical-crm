'use strict';

const Boom = require('@hapi/boom');

const transformEntityValidationError = error => {
  const boomError = Boom.badData(error.message);
  boomError.output.payload.validationDetails = error.validationDetails;
  return boomError;
};

const transformUniqueConstraintViolation = error => Boom.conflict(error.message);
const transformForeignKeyConstraintViolation = error => Boom.conflict(error.message);

const commandMap = new Map();
commandMap.set('UniqueConstraintViolation', transformUniqueConstraintViolation);
commandMap.set('EntityValidationError', transformEntityValidationError);
commandMap.set('ForeignKeyConstraintViolation', transformForeignKeyConstraintViolation);

/**
 * Maps a service error to a Boom error for providing an HTTP response
 * If the error is unknown, it is rethrown
 * @param {Error}
 * @return {Error} Boom error
 */
const mapErrorResponse = error => {
  const func = commandMap.get(error.name);

  if (func) {
    return func(error);
  }
  throw error;
};

const mapValidationErrorDetails = error => error.details.map(detail => detail.message);

exports.mapErrorResponse = mapErrorResponse;
exports.mapValidationErrorDetails = mapValidationErrorDetails;
