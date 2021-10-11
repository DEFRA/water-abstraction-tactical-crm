'use strict';

const Joi = require('joi');
const validators = require('../../lib/validators-v2');
const contactTypes = require('../../lib/contact-types');

const personSchema = Joi.object().keys({
  salutation: validators.OPTIONAL_STRING,
  firstName: validators.REQUIRED_STRING,
  middleInitials: validators.OPTIONAL_STRING,
  lastName: validators.REQUIRED_STRING,
  suffix: validators.OPTIONAL_STRING,
  department: validators.OPTIONAL_STRING,
  isTest: validators.TEST_FLAG,
  dataSource: validators.DATA_SOURCE
});

const departmentSchema = Joi.object().keys({
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
  const { type, ...rest } = contact;
  if (schemas[type] === undefined) {
    return { value: null, error: null };
  }
  const schema = type === contactTypes.PERSON ? personSchema : departmentSchema;
  return schema.validate(rest, { abortEarly: false });
};
