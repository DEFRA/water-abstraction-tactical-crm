'use strict';

const Joi = require('@hapi/joi');
const validators = require('../../lib/validators');

const personSchema = Joi.object({
  salutation: validators.OPTIONAL_STRING,
  firstName: validators.REQUIRED_STRING,
  middleInitials: validators.OPTIONAL_STRING,
  lastName: validators.REQUIRED_STRING,
  suffix: validators.OPTIONAL_STRING,
  department: validators.OPTIONAL_STRING,
  isTest: validators.TEST_FLAG,
  dataSource: validators.DATA_SOURCE
});

const departmentSchema = Joi.object({
  department: validators.REQUIRED_STRING,
  isTest: validators.TEST_FLAG,
  dataSource: validators.DATA_SOURCE
});

const schemas = {
  person: personSchema,
  department: departmentSchema
};

/**
 * Validates that an object conforms to the requirements of a contact.
 */
exports.validate = contact => {
  const { contactType, ...rest } = contact;
  return schemas[contactType].validate(rest, { abortEarly: false });
};
