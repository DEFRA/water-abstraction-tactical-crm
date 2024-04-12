'use strict'

const Boom = require('@hapi/boom')

const { logger } = require('../../../logger')
const invoiceAccountService = require('../../services/invoice-accounts')

const getInvoiceAccounts = async request => {
  try {
    return invoiceAccountService.getInvoiceAccountsByIds(request.query.id)
  } catch (err) {
    logger.error('Could not get invoice accounts', err.stack)
    return Boom.boomify(err)
  }
}

const getInvoiceAccountByRef = async request => {
  try {
    const { ref } = request.query
    return invoiceAccountService.getInvoiceAccountByRef(ref)
  } catch (err) {
    logger.error('Could not get invoice account', err.stack)
    return Boom.boomify(err)
  }
}

const updateInvoiceAccountsWithCustomerFileReference = async (request, h) => {
  try {
    const { fileReference, exportedAt, exportedCustomers } = request.payload
    invoiceAccountService.updateInvoiceAccountsWithCustomerFileReference(fileReference, exportedAt, exportedCustomers.join(','))
    return h.response({
      data: {},
      error: null
    }).code(202)
  } catch (err) {
    logger.error('Could not update invoice accounts', err.stack)
    return Boom.boomify(err)
  }
}

exports.getInvoiceAccounts = getInvoiceAccounts
exports.getInvoiceAccountByRef = getInvoiceAccountByRef
exports.updateInvoiceAccountsWithCustomerFileReference = updateInvoiceAccountsWithCustomerFileReference
