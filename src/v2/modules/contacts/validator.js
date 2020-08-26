'use strict';

const Joi = require('@hapi/joi');
const validators = require('../../lib/validators');
const contactTypes = require('../../lib/contact-types');

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

const typeSchema = Joi.string().valid(Object.values(contactTypes)).required();

/**
 * Validates that an object conforms to the requirements of a contact.
 */
exports.validate = contact => {
  const { type, ...rest } = contact;
  const { error } = typeSchema.validate(type);
  if (error) return { error };
  return schemas[type].validate(rest, { abortEarly: false });
};
