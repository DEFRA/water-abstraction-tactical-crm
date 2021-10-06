'use strict';

const schema = require('@envage/water-abstraction-helpers').validators.VALID_ADDRESS;

/**
 * Validates that an object conforms to the requirements of an address.
 */
exports.validate = address => {
  const valRes = schema.validate(address, { abortEarly: false });
  const { error, value } = valRes;
  if (error) {
    return valRes;
  }
  return { value, error: null };
};
