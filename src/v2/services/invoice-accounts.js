'use strict';

const invoiceAccountValidator = require('../modules/invoice-accounts/validator');
const invoiceAccountsRepo = require('../connectors/repository/invoice-accounts');
const invoiceAccountAddressesRepo = require('../connectors/repository/invoice-account-addresses');
const mappers = require('../mappers');
const errors = require('../lib/errors');
const { mapValidationErrorDetails } = require('../lib/map-error-response');
const dateHelpers = require('../lib/date-helpers');

const createInvoiceAccount = async invoiceAccount => {
  const { error, value: validatedInvoiceAccount } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccount);

  if (error) {
    throw new errors.EntityValidationError('Invoice account not valid', mapValidationErrorDetails(error));
  }

  return invoiceAccountsRepo.create(validatedInvoiceAccount);
};

const getInvoiceAccount = invoiceAccountId => invoiceAccountsRepo.findOne(invoiceAccountId);

const getInvoiceAccountsByIds = async ids => {
  const results = await invoiceAccountsRepo.findWithCurrentAddress(ids);
  return results.map(mappers.invoiceAccount.currentAddressOnly);
};

const ensureDateRangeDoesNotOverlapWithExistingAddress = async invoiceAccountAddress => {
  const allInvoiceAccountAddresses = await invoiceAccountAddressesRepo.findAll(invoiceAccountAddress.invoiceAccountId);

  if (dateHelpers.hasOverlap(invoiceAccountAddress, allInvoiceAccountAddresses)) {
    throw new errors.ConflictingDataError('Existing invoice account address exists for date range');
  }
};

const createInvoiceAccountAddress = async invoiceAccountAddress => {
  const { error, value: validatedInvoiceAccountAddress } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddress);
  if (error) {
    throw new errors.EntityValidationError('Invoice account address not valid', mapValidationErrorDetails(error));
  }
  await ensureDateRangeDoesNotOverlapWithExistingAddress(validatedInvoiceAccountAddress);

  return invoiceAccountAddressesRepo.create(validatedInvoiceAccountAddress);
};

exports.createInvoiceAccount = createInvoiceAccount;
exports.getInvoiceAccount = getInvoiceAccount;
exports.getInvoiceAccountsByIds = getInvoiceAccountsByIds;

exports.createInvoiceAccountAddress = createInvoiceAccountAddress;
