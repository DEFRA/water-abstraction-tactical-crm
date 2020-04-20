
const Boom = require('@hapi/boom');
const errors = require('./errors');

/**
 * Maps a service error to a Boom error for providing an HTTP response
 * If the error is unknown, it is rethrown
 * @param {Error}
 * @return {Error} Boom error
 */
const mapErrorResponse = error => {
  if (error instanceof errors.UniqueConstraintViolation) {
    return Boom.conflict(error.message);
  } else if (error instanceof errors.ForeignKeyConstraintViolation) {
    return Boom.conflict(error.message);
  }
  throw error;
};

module.exports = mapErrorResponse;
