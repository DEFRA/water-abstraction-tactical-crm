'use strict'

/**
 * Checks if the PG error is a constraint error
 *
 * @param {Error} err - the PG error
 * @param {String} constraint - the constraint name
 * @return {Boolean}
 */
const isConstraintViolationError = (err, constraint) =>
  err.code === '23505' && err.constraint === constraint

exports.isConstraintViolationError = isConstraintViolationError
