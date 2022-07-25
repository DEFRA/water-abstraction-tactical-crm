'use strict'

const { InvoiceAccount } = require('../bookshelf')
const queries = require('./queries/invoice-accounts')
const raw = require('./lib/raw')
const helpers = require('./helpers')

/**
 * Find single InvoiceAccount with relations by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => {
  const result = await InvoiceAccount
    .forge({ invoiceAccountId: id })
    .fetch({
      withRelated: [
        'company',
        'invoiceAccountAddresses',
        'invoiceAccountAddresses.address',
        'invoiceAccountAddresses.agentCompany',
        'invoiceAccountAddresses.contact'
      ],
      require: false
    })

  return result ? result.toJSON() : null
}

/**
 * Find single InvoiceAccount by Ref
 * @param {String} ref
 * @return {Promise<Object>}
 */
const findOneByAccountNumber = async ref => {
  const result = await InvoiceAccount
    .forge({ invoiceAccountNumber: ref.toUpperCase() })
    .fetch({
      require: false
    })

  return result ? result.toJSON() : null
}

/**
 * Find all invoice accounts that belong to a company
 * @param {String} companyId
 */
const findAllByCompanyId = async companyId => {
  const result = await InvoiceAccount
    .collection()
    .where({ company_id: companyId })
    .fetch({
      withRelated: [
        'company',
        'invoiceAccountAddresses',
        'invoiceAccountAddresses.address',
        'invoiceAccountAddresses.agentCompany',
        'invoiceAccountAddresses.contact'
      ],
      require: false
    })

  return result ? result.toJSON() : null
}

/**
 * Find many InvoiceAccounts with relations by IDs
 * @param {Array<String>} ids
 * @return {Promise<Array>}
 */
const findWithCurrentAddress = async ids => {
  const result = await InvoiceAccount
    .collection()
    .where('invoice_account_id', 'in', ids)
    .fetch({
      withRelated: [
        'company',
        'company.companyContact',
        'company.companyContact.contact',
        'company.companyContact.role',
        {
          invoiceAccountAddresses: qb => qb
            .where('end_date', null)
        },
        'invoiceAccountAddresses.address',
        'invoiceAccountAddresses.agentCompany',
        'invoiceAccountAddresses.contact'
      ]
    })
  return result.toJSON()
}

/**
 * Create a new invoice account in crm_v2.invoice_accounts
 *
 * @param {Object} invoiceAccount An object to persist to crm_v2.invoice_accounts
 * @returns {Object} The created invoice account from the database
 */
const create = async invoiceAccount => helpers.create(InvoiceAccount, invoiceAccount)

const deleteOne = async id => helpers.deleteOne(InvoiceAccount, 'invoiceAccountId', id)

const deleteTestData = async () => {
  await raw.deleteRows(queries.deleteTestInvoiceAccounts, {})
  await helpers.deleteTestData(InvoiceAccount)
}

/**
 * Finds the invoice account with the largest numeric account number in a particular region
 * @param {String} regionCode
 * @return {Promise<Object|null>}
 */
const findOneByGreatestAccountNumber = async regionCode => {
  const query = `${regionCode}%`
  return raw.singleRow(queries.findOneByGreatestAccountNumber, { query })
}

const findAllWhereEntitiesHaveUnmatchingHashes = () => raw.multiRow(queries.findAllWhereEntitiesHaveUnmatchingHashes)

const updateInvoiceAccountsWithCustomerFileReference = (fileReference, exportedAt, exportedCustomers) =>
  raw.multiRow(queries.updateInvoiceAccountsWithCustomerFileReference, {
    fileReference, exportedAt, exportedCustomers
  })

exports.create = create
exports.deleteOne = deleteOne
exports.deleteTestData = deleteTestData
exports.findOne = findOne
exports.findOneByAccountNumber = findOneByAccountNumber
exports.findWithCurrentAddress = findWithCurrentAddress
exports.findOneByGreatestAccountNumber = findOneByGreatestAccountNumber
exports.findAllByCompanyId = findAllByCompanyId
exports.findAllWhereEntitiesHaveUnmatchingHashes = findAllWhereEntitiesHaveUnmatchingHashes
exports.updateInvoiceAccountsWithCustomerFileReference = updateInvoiceAccountsWithCustomerFileReference
