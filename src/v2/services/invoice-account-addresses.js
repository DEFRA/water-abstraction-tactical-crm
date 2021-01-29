'use strict';

const moment = require('moment');

const invoiceAccountAddressesRepo = require('../connectors/repository/invoice-account-addresses');
const invoiceAccountsRepo = require('../connectors/repository/invoice-accounts');
const contactsRepo = require('../connectors/repository/contacts');
const addressesRepo = require('../connectors/repository/addresses');

const invoiceAccountValidator = require('./lib/invoice-accounts-validator');
const errors = require('../lib/errors');
const dateHelpers = require('../lib/date-helpers');
const { mapValidationErrorDetails } = require('../lib/map-error-response');

const ensureDateRangeDoesNotOverlapWithExistingAddress = async invoiceAccountAddress => {
  const allInvoiceAccountAddresses = await invoiceAccountAddressesRepo.findAll(invoiceAccountAddress.invoiceAccountId);

  if (dateHelpers.hasOverlap(invoiceAccountAddress, allInvoiceAccountAddresses)) {
    throw new errors.ConflictingDataError('Existing invoice account address exists for date range');
  }
};

const getCompanyId = (invoiceAccount, invoiceAccountAddress) =>
  invoiceAccountAddress.agentCompanyId || invoiceAccount.companyId;

/**
 * Checks the contact ID is in the correct company - if not a conflicting data error
 * is thrown
 * @param {Object} invoiceAccountAddress
 * @param {Object} invoiceAccount
 * @return {Promise}
 */
const ensureContactIsInCompany = async (invoiceAccountAddress, invoiceAccount) => {
  const { contactId } = invoiceAccountAddress;
  // If contact set, need to check it is in a valid company
  if (contactId) {
    // If an agent company specified, contact should be in that company.
    // Otherwise it should be in the licence-holders' company
    const companyId = getCompanyId(invoiceAccount, invoiceAccountAddress);
    const contact = await contactsRepo.findOneWithCompanies(contactId);
    const foundCompanyContact = contact.companyContacts.find(
      companyContact => companyContact.companyId === companyId
    );
    if (!foundCompanyContact) {
      throw new errors.ConflictingDataError(`Specified contact ${contactId} is not in the company ${companyId}`);
    }
  }
};

/**
 * Checks the address ID is in the correct company - if not a conflicting data error
 * is thrown
 * @param {Object} invoiceAccountAddress
 * @param {Object} invoiceAccount
 * @return {Promise}
 */
const ensureAddressIsInCompany = async (invoiceAccountAddress, invoiceAccount) => {
  const { addressId } = invoiceAccountAddress;

  // If an agent company specified, it should be in that company.
  // Otherwise it should be in the licence-holders' company
  const companyId = getCompanyId(invoiceAccount, invoiceAccountAddress);
  const address = await addressesRepo.findOneWithCompanies(addressId);
  const foundAddress = address.companyAddresses.find(
    companyAddress => companyAddress.companyId === companyId
  );
  if (!foundAddress) {
    throw new errors.ConflictingDataError(`Specified address ${addressId} is not in company ${companyId}`);
  }
};

/**
 * Create an invoice account address
 *
 * @param {Object} invoiceAccountAddress
 * @return {Promise<Object>} new record
 */
const createInvoiceAccountAddress = async invoiceAccountAddress => {
  // Get the invoice account
  // This is needed in the validator to ensure the agent company is not to the LH company
  const invoiceAccount = await invoiceAccountsRepo.findOne(invoiceAccountAddress.invoiceAccountId);

  const { error, value: validatedInvoiceAccountAddress } = invoiceAccountValidator.validateInvoiceAccountAddress(invoiceAccountAddress, invoiceAccount);
  if (error) {
    throw new errors.EntityValidationError('Invoice account address not valid', mapValidationErrorDetails(error));
  }
  await ensureDateRangeDoesNotOverlapWithExistingAddress(validatedInvoiceAccountAddress);
  await ensureAddressIsInCompany(invoiceAccountAddress, invoiceAccount);
  await ensureContactIsInCompany(invoiceAccountAddress, invoiceAccount);

  return invoiceAccountAddressesRepo.create(validatedInvoiceAccountAddress);
};

/**
 * Delete a single invoiceAccountAddress record by ID
 * @param {String} invoiceAccountAddressId - guid
 * @return {Promise}
 */
const deleteInvoiceAccountAddress = invoiceAccountAddressId =>
  invoiceAccountAddressesRepo.deleteOne(invoiceAccountAddressId);

/**
 * Update a single invoiceAccountAddress record by ID
 * @param {String} invoiceAccountAddressId - guid
 * @param {Object} updates
 * @return {Promise<Object>}
 */
const updateInvoiceAccountAddress = async (invoiceAccountAddressId, updates) => {
  // Only the endDate can be changed, other properties are immutable
  const { endDate } = updates;
  const invoiceAccountAddress = await invoiceAccountAddressesRepo.findOne(invoiceAccountAddressId);
  if (!invoiceAccountAddress) {
    throw new errors.NotFoundError(`Invoice account address ${invoiceAccountAddressId} not found`);
  }
  if (endDate && moment(endDate).isBefore(invoiceAccountAddress.startDate, 'day')) {
    throw new errors.ConflictingDataError(`The end date cannot be before the start date ${invoiceAccountAddress.startDate}`);
  }
  return invoiceAccountAddressesRepo.update(invoiceAccountAddressId, { endDate });
};

exports.createInvoiceAccountAddress = createInvoiceAccountAddress;
exports.deleteInvoiceAccountAddress = deleteInvoiceAccountAddress;
exports.updateInvoiceAccountAddress = updateInvoiceAccountAddress;
