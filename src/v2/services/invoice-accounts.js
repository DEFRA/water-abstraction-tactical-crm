'use strict';

const invoiceAccountValidator = require('../modules/invoice-accounts/validator');
const invoiceAccountsRepo = require('../connectors/repository/invoice-accounts');
const mappers = require('../mappers');
const errors = require('../lib/errors');

const createInvoiceAccount = async invoiceAccount => {
  const { error, value: validatedInvoiceAccount } = invoiceAccountValidator.validate(invoiceAccount);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new errors.EntityValidationError('Invoice account not valid', details);
  }

  return invoiceAccountsRepo.create(validatedInvoiceAccount);
};

const getInvoiceAccount = invoiceAccountId => invoiceAccountsRepo.findOne(invoiceAccountId);

const getInvoiceAccountsByIds = async ids => {
  const results = await invoiceAccountsRepo.findWithCurrentAddress(ids);
  return results.map(mappers.invoiceAccount.currentAddressOnly);
};

exports.createInvoiceAccount = createInvoiceAccount;
exports.getInvoiceAccount = getInvoiceAccount;
exports.getInvoiceAccountsByIds = getInvoiceAccountsByIds;
