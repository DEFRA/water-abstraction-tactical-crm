'use strict';

const Joi = require('joi').extend(require('@joi/date'));
const validators = require('../../lib/validators-v2');
const invoiceAccountNumberRegex = /^[ABENSTWY][0-9]{8}A$/;
const DATE = Joi.date().utc().format('YYYY-MM-DD');

const invoiceAccountSchema = Joi.object().keys({
  companyId: Joi.string().guid().required(),
  invoiceAccountNumber: Joi.string().regex(invoiceAccountNumberRegex).required(),
  startDate: DATE.required(),
  endDate: DATE.min(Joi.ref('startDate')).optional().default(null).allow(null),
  isTest: Joi.boolean().optional().default(false)
});

const createInvoiceAccountAddressSchema = invoiceAccount => {
  // The agent company ID should not be the same as the LH company
  const { companyId } = invoiceAccount.company;

  return Joi.object().keys({
    invoiceAccountId: Joi.string().guid().required(),
    addressId: Joi.string().guid().required(),
    startDate: DATE.required(),
    endDate: DATE.min(Joi.ref('startDate')).optional().default(null).allow(null),
    isTest: Joi.boolean().optional().default(false),
    agentCompanyId: validators.GUID.allow(null).invalid(companyId),
    contactId: validators.GUID.allow(null)
  });
};

/**
 * Validates that an object conforms to the requirements of an invoice account.
 */
exports.validateInvoiceAccount = invoiceAccount => {
  const valRes = invoiceAccountSchema.validate(invoiceAccount, { abortEarly: false });
  const { error, value } = valRes;
  if (error) return valRes;
  return { value, error: null };
};

/**
 * Validates that an object conforms to the requirements of an invoice account address.
 */
exports.validateInvoiceAccountAddress = (invoiceAccountAddress, invoiceAccount) => {
  const typeSchema = createInvoiceAccountAddressSchema(invoiceAccount);
  const valRes = typeSchema.validate(invoiceAccountAddress, { abortEarly: false });
  const { error, value } = valRes;
  if (error) return valRes;
  return { value, error: null };
};
