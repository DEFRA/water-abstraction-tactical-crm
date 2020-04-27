'use strict';

const invoiceAccountValidator = require('../modules/invoice-accounts/validator');
const invoiceAccountsRepo = require('../connectors/repository/invoice-accounts');
const invoiceAccountAddressesRepo = require('../connectors/repository/invoice-account-addresses');
const mappers = require('../mappers');
const errors = require('../lib/errors');
const dateHelpers = require('../lib/date-helpers');

const createInvoiceAccount = async invoiceAccount => {
  const { error, value: validatedInvoiceAccount } = invoiceAccountValidator.validate(invoiceAccount, 'invoiceAccount');

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

const addInvoiceAccountAddress = async invoiceAccountAddress => {
  const { error, value: validatedInvoiceAccountAddress } = invoiceAccountValidator.validate(invoiceAccountAddress, 'invoiceAccountAddress');

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new errors.EntityValidationError('Invoice account address not valid', details);
  }

  const { invoiceAccountId } = invoiceAccountAddress;
  const recentInvoiceAccountAddress = await invoiceAccountAddressesRepo.findMostRecent(invoiceAccountId);

  if (recentInvoiceAccountAddress && dateHelpers.newEntityOverlapsExistingEntity(recentInvoiceAccountAddress, validatedInvoiceAccountAddress)) {
    throw new errors.UniqueConstraintViolation(`New address conflicts with existing address for Invoice account: ${invoiceAccountId}`);
  }

  return invoiceAccountsRepo.addAddress(validatedInvoiceAccountAddress);
};

exports.createInvoiceAccount = createInvoiceAccount;
exports.getInvoiceAccount = getInvoiceAccount;
exports.getInvoiceAccountsByIds = getInvoiceAccountsByIds;

exports.addInvoiceAccountAddress = addInvoiceAccountAddress;
