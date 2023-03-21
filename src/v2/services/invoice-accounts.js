'use strict'

const invoiceAccountValidator = require('./lib/invoice-accounts-validator')
const invoiceAccountsRepo = require('../connectors/repository/invoice-accounts')
const mappers = require('../mappers')
const errors = require('../lib/errors')
const { mapValidationErrorDetails } = require('../lib/map-error-response')
const handleRepoError = require('./lib/error-handler')

const InvoiceAccountNumber = require('./invoice-account-number.js')

/**
 * Pre-processes the invoice account object for creation of a new invoice account.
 * If only a region code is supplied, a new invoice account number is generated and used
 * @param {Object} invoiceAccount
 * @return {Promise<Object>}
 */
const getInvoiceAccountData = async invoiceAccount => {
  const { regionCode, ...rest } = invoiceAccount
  // Auto-generate invoice account number
  if (regionCode) {
    const invoiceAccountNumber = await InvoiceAccountNumber.generate(regionCode)

    return {
      ...rest,
      invoiceAccountNumber
    }
  }
  // Use supplied invoice account number
  return invoiceAccount
}

const createInvoiceAccount = async payload => {
  const invoiceAccount = await getInvoiceAccountData(payload)

  const { error, value: validatedInvoiceAccount } = invoiceAccountValidator.validateInvoiceAccount(invoiceAccount)

  if (error) {
    throw new errors.EntityValidationError('Invoice account not valid', mapValidationErrorDetails(error))
  }

  try {
    const data = await invoiceAccountsRepo.create(validatedInvoiceAccount)
    return data
  } catch (err) {
    handleRepoError(err)
  }
}

const getInvoiceAccount = invoiceAccountId => invoiceAccountsRepo.findOne(invoiceAccountId)

const getInvoiceAccountByRef = ref => invoiceAccountsRepo.findOneByAccountNumber(ref)

const deleteInvoiceAccount = invoiceAccountId => invoiceAccountsRepo.deleteOne(invoiceAccountId)

const getInvoiceAccountsByIds = async ids => {
  const results = await invoiceAccountsRepo.findWithCurrentAddress(ids)
  return results.map(mappers.invoiceAccount.mostRecentAddressOnly)
}

const getInvoiceAccountsWithRecentlyUpdatedEntities = () => invoiceAccountsRepo.findAllWhereEntitiesHaveUnmatchingHashes()

exports.createInvoiceAccount = createInvoiceAccount
exports.getInvoiceAccountByRef = getInvoiceAccountByRef
exports.deleteInvoiceAccount = deleteInvoiceAccount
exports.getInvoiceAccount = getInvoiceAccount
exports.getInvoiceAccountsByIds = getInvoiceAccountsByIds
exports.getInvoiceAccountsWithRecentlyUpdatedEntities = getInvoiceAccountsWithRecentlyUpdatedEntities
exports.updateInvoiceAccountsWithCustomerFileReference = invoiceAccountsRepo.updateInvoiceAccountsWithCustomerFileReference
