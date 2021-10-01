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

const typeSchema = Joi.string().required().allow(contactTypes);

/**
 * Validates that an object conforms to the requirements of a contact.
 */
exports.validate = contact => {
  const { type, ...rest } = contact;
  const { error } = typeSchema.validate(type);

  if (schemas[type] === undefined) {
    return { result: { error: 'schemas[type] is undefined' } };
  }

  if (error) return { error };
  return schemas[type].validate(rest, { abortEarly: false });
};
