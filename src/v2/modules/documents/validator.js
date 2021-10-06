'use strict';

const Joi = require('joi').extend(require('@joi/date'));
const validators = require('../../lib/validators-v2');

const documentSchema = Joi.object().keys({
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

const documentRoleSchema = Joi.object().keys({
  documentId: validators.GUID,
  role: Joi.string().valid('billing', 'licenceHolder').required(),
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
exports.validateDocumentRole = documentRole => {
  const valRes = documentRoleSchema.validate(documentRole, { abortEarly: false });
  const { error, value } = valRes;
  if (error) return valRes;
  return { value, error: null };
};

/**
 * Validates that an object conforms to the requirements of an document.
 */
exports.validateDocument = document => {
  const valRes = documentSchema.validate(document, { abortEarly: false });
  const { error, value } = valRes;
  if (error) return valRes;
  return { value, error: null };
};
