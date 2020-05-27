'use strict';

const Joi = require('@hapi/joi');

/**
 * Last name is always required
 * One of initials or first name must be supplied
 */
const schema = Joi.object({
  salutation: Joi.string().trim().empty('').optional(),
  firstName: Joi.string().trim().empty('').optional(),
  initials: Joi.string().trim().empty('').optional(),
  lastName: Joi.string().trim().empty('').required(),
  middleName: Joi.string().trim().empty('').optional(),
  isTest: Joi.boolean().optional().default(false)
}).or('firstName', 'initials');

/**
 * Validates that an object conforms to the requirements of a contact.
 */
exports.validate = contact => Joi.validate(contact, schema, { abortEarly: false });
