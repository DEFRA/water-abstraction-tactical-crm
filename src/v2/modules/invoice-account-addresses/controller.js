'use strict'

const { wrapServiceCall } = require('../../lib/wrap-service-call')
const invoiceAccountAddressService = require('../../services/invoice-account-addresses')
const entityHandlers = require('../../lib/entity-handlers')

const getLocation = entity => `/crm/2.0/invoice-account-addresses/${entity.invoiceAccountAddressId}`

exports.postInvoiceAccountAddress = (request, h) =>
  entityHandlers.createEntity(request, h, 'invoiceAccountAddress', getLocation)

exports.deleteInvoiceAccountAddress = (request, h) =>
  entityHandlers.deleteEntity(request, h, 'invoiceAccountAddress')

exports.patchInvoiceAccountAddress = wrapServiceCall(invoiceAccountAddressService, 'updateInvoiceAccountAddress',
  request => [request.params.invoiceAccountAddressId, request.payload])
