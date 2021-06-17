'use strict';

const Joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'));
const validators = require('../../lib/validators');

const documentSchema = Joi.object({
  regime: Joi.string().required().valid('water'),
  documentType: Joi.string().required().valid('abstraction_licence'),
  documentRef: Joi.string().required(),
  startDate: validators.START_DATE,
  endDate: validators.END_DATE,
  isTest: validators.TEST_FLAG
});

const requiredUuidUnlessRoleIs = role => {
  return Joi.string().uuid().required().when('role', {
    is: role,
    then: Joi.any().optional().valid(null)
  });
};

const optionalUuidUnlessRoleIs = role => {
  return Joi.string().uuid().optional().allow(null).when('role', {
    is: role,
    then: Joi.any().optional().valid(null)
  });
};

const documentRoleSchema = Joi.object({
  documentId: validators.GUID,
  role: Joi.string().valid('billing', 'licenceHolder').required(),
  isDefault: Joi.boolean().optional().default(false),
  startDate: validators.START_DATE,
  endDate: validators.END_DATE,
  invoiceAccountId: requiredUuidUnlessRoleIs('licenceHolder'),
  companyId: requiredUuidUnlessRoleIs('billing'),
  contactId: optionalUuidUnlessRoleIs('billing'),
  addressId: requiredUuidUnlessRoleIs('billing'),
  isTest: validators.TEST_FLAG
});

/**
 * Validates that an object conforms to the requirements of a document role
 * based on the role being proposed.
 */
exports.validateDocumentRole = documentRole =>
  Joi.validate(documentRole, documentRoleSchema, { abortEarly: false });

/**
 * Validates that an object conforms to the requirements of an document.
 */
exports.validateDocument = document =>
  Joi.validate(document, documentSchema, { abortEarly: false });
