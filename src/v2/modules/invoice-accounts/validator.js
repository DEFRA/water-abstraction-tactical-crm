'use strict';

const Joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'));

const invoiceAccountNumberRegex = /^[ABENSTWY][0-9]{8}A$/;
const DATE = Joi.date().utc().format('YYYY-MM-DD');

const invoiceAccountSchema = Joi.object({
  companyId: Joi.string().guid().required(),
  invoiceAccountNumber: Joi.string().regex(invoiceAccountNumberRegex).required(),
  startDate: DATE.required(),
  endDate: DATE.min(Joi.ref('startDate')).optional().default(null).allow(null),
  isTest: Joi.boolean().optional().default(false)
});

const invoiceAccountAddressSchema = Joi.object({
  invoiceAccountId: Joi.string().guid().required(),
  addressId: Joi.string().guid().required(),
  startDate: DATE.required(),
  endDate: DATE.min(Joi.ref('startDate')).optional().default(null).allow(null),
  isTest: Joi.boolean().optional().default(false)
});

/**
 * Validates that an object conforms to the requirements of a contact.
 */
exports.validateInvoiceAccount = invoiceAccount =>
  Joi.validate(invoiceAccount, invoiceAccountSchema, { abortEarly: false });

exports.validateInvoiceAccountAddress = invoiceAccountAddress =>
  Joi.validate(invoiceAccountAddress, invoiceAccountAddressSchema, { abortEarly: false });
