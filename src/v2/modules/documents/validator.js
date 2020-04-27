'use strict';

const Joi = require('@hapi/joi');
const validators = require('../../lib/validators');

const optionalUuidUnlessRoleIs = role => {
  return Joi.string().uuid().allow(null).when('role', {
    is: role,
    then: Joi.required().empty(null)
  });
};

const schema = Joi.object({
  documentId: validators.GUID,
  role: Joi.string().valid('billing', 'licenceHolder').required(),
  isDefault: Joi.boolean().optional().default(false),
  startDate: validators.START_DATE,
  endDate: validators.END_DATE,
  invoiceAccountId: optionalUuidUnlessRoleIs('billing'),
  companyId: optionalUuidUnlessRoleIs('licenceHolder'),
  contactId: optionalUuidUnlessRoleIs('licenceHolder'),
  addressId: optionalUuidUnlessRoleIs('licenceHolder'),
  isTest: validators.TEST_FLAG
});

/**
 * Validates that an object conforms to the requirements of a document role
 * based on the role being proposed.
 */
exports.validateDocumentRole = documentRole =>
  Joi.validate(documentRole, schema, { abortEarly: false });
