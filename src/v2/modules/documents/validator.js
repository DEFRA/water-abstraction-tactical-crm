'use strict';

const Joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'));
const DATE = Joi.date().format('YYYY-MM-DD');

const schema = Joi.object({
  regime: Joi.string().required().valid('water'),
  documentType: Joi.string().required().valid('abstraction_licence'),
  versionNumber: Joi.number().integer().required().min(0),
  documentRef: Joi.string().required(),
  status: Joi.string().required().valid('current', 'draft', 'superseded'),
  startDate: DATE.required(),
  endDate: DATE.min(Joi.ref('startDate')).optional().default(null).allow(null),
  isTest: Joi.boolean().optional().default(false)
});

/**
 * Validates that an object conforms to the requirements of an address.
 */
exports.validate = document => Joi.validate(document, schema, { abortEarly: false });
