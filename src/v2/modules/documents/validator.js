'use strict';

const Joi = require('@hapi/joi');
const validators = require('../../lib/validators');

const requiredUuidUnlessRoleIs = role => {
  return Joi.string().uuid().required().when('role', {
    is: role,
    then: Joi.any().optional().valid(null)
  });
};

const schema = Joi.object({
  documentId: validators.GUID,
  role: Joi.string().valid('billing', 'licenceHolder').required(),
  isDefault: Joi.boolean().optional().default(false),
  startDate: validators.START_DATE,
  endDate: validators.END_DATE,
  invoiceAccountId: requiredUuidUnlessRoleIs('licenceHolder'),
  companyId: requiredUuidUnlessRoleIs('billing'),
  contactId: requiredUuidUnlessRoleIs('billing'),
  addressId: requiredUuidUnlessRoleIs('billing'),
  isTest: validators.TEST_FLAG
});

/**
 * Validates that an object conforms to the requirements of a document role
 * based on the role being proposed.
 */
exports.validateDocumentRole = documentRole =>
  Joi.validate(documentRole, schema, { abortEarly: false });
