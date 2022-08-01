'use strict'

const schema = require('@envage/water-abstraction-helpers').validators.VALID_ADDRESS

/**
 * Validates that an object conforms to the requirements of an address.
 */
exports.validate = address =>
  schema.validate(address, { abortEarly: false })
