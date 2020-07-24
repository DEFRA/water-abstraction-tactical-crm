'use strict';

const invoiceAccountValidator = require('../modules/invoice-accounts/validator');
const invoiceAccountsRepo = require('../connectors/repository/invoice-accounts');
const invoiceAccountAddressesRepo = require('../connectors/repository/invoice-account-addresses');
const contactsRepo = require('../connectors/repository/contacts');
const addressesRepo = require('../connectors/repository/addresses');
const mappers = require('../mappers');
const errors = require('../lib/errors');
const { mapValidationErrorDetails } = require('../lib/map-error-response');
const dateHelpers = require('../lib/date-helpers');
const handleRepoError = require('./lib/error-handler');

/**
 * Creates a new invoice account number in the specified region
 * @param {String} regionCode
 * @param {Number} accountNumber
 * @return {String} formatted invoice account number
 */
const createAccountNumber = (regionCode, accountNumber = 0) =>
  `${regionCode}${accountNumber.toString().padStart(8, '0')}A`;

/**
 * Parses an invoice account number into an alphabetic region code
 * and a numeric account number
 * @param {String} invoiceAccountNumber
 * @return {Object} parsed account number
 */
const parseAccountNumber = invoiceAccountNumber => ({
  regionCode: invoiceAccountNumber.substr(0, 1),
  number: parseInt(invoiceAccountNumber.replace(/[^0-9]/g, ''))
});

/**
 * Pre-processes the invoice account object for creation of a new invoice account.
 * If only a region code is supplied, a new invoice account number is generated and used
 * @param {Object} invoiceAccount
 * @return {Promise<Object>}
 */
const getInvoiceAccountData = async invoiceAccount => {
  const { regionCode, ...rest } = invoiceAccount;
  // Auto-generate invoice account number
  if (regionCode) {
    const currentMaxAccount = await invoiceAccountsRepo.findOneByGreatestAccountNumber(regionCode);
    const currentMaxAccountNumber = currentMaxAccount
      ? parseAccountNumber(currentMaxAccount.invoiceAccountNumber).number
      : 0;

    return {
      ...rest,
      invoiceAccountNumber: createAccountNumber(regionCode, currentMaxAccountNumber + 1)
    };
  }
  // Use supplied invoice account number
  return invoiceAccount;
};

const createInvoiceAccount = async payload => {
  const invoiceAccount = await getInvoiceAccountData(payload);

  const { error, value: validatedInvoiceAccount } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccount);

  if (error) {
    throw new errors.EntityValidationError('Invoice account not valid', mapValidationErrorDetails(error));
  }

  try {
    const data = await invoiceAccountsRepo.create(validatedInvoiceAccount);
    return data;
  } catch (err) {
    handleRepoError(err);
  }
};

const getInvoiceAccount = invoiceAccountId => invoiceAccountsRepo.findOne(invoiceAccountId);

const deleteInvoiceAccount = invoiceAccountId => invoiceAccountsRepo.deleteOne(invoiceAccountId);

const getInvoiceAccountsByIds = async ids => {
  const results = await invoiceAccountsRepo.findWithCurrentAddress(ids);
  return results.map(mappers.invoiceAccount.mostRecentAddressOnly);
};

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

const deleteInvoiceAccountAddress = invoiceAccountAddressId => invoiceAccountAddressesRepo.deleteOne(invoiceAccountAddressId);

exports.createInvoiceAccount = createInvoiceAccount;
exports.deleteInvoiceAccount = deleteInvoiceAccount;
exports.getInvoiceAccount = getInvoiceAccount;
exports.getInvoiceAccountsByIds = getInvoiceAccountsByIds;

exports.createInvoiceAccountAddress = createInvoiceAccountAddress;
exports.deleteInvoiceAccountAddress = deleteInvoiceAccountAddress;
