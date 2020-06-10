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

const createInvoiceAccountAddressSchema = invoiceAccount => {
  // The agent company ID should not be the same as the LH company
  const { companyId } = invoiceAccount.company;

  return Joi.object({
    invoiceAccountId: Joi.string().guid().required(),
    addressId: Joi.string().guid().required(),
    startDate: DATE.required(),
    endDate: DATE.min(Joi.ref('startDate')).optional().default(null).allow(null),
    isTest: Joi.boolean().optional().default(false),
    agentCompanyId: Joi.string().guid().allow(null).invalid(companyId).default(null),
    contactId: Joi.string().guid().allow(null).default(null)
  });
};

/**
 * Validates that an object conforms to the requirements of an invoice account.
 */
exports.validateInvoiceAccount = invoiceAccount =>
  Joi.validate(invoiceAccount, invoiceAccountSchema, { abortEarly: false });

/**
 * Validates that an object conforms to the requirements of an invoice account address.
 */
exports.validateInvoiceAccountAddress = (invoiceAccountAddress, invoiceAccount) =>
  Joi.validate(invoiceAccountAddress, createInvoiceAccountAddressSchema(invoiceAccount), { abortEarly: false });
