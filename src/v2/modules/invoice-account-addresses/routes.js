'use strict'

const controller = require('./controller')
const validators = require('../../lib/validators-v2')
const Joi = require('joi')

exports.postInvoiceAccountAddress = {
  method: 'POST',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}/addresses',
  handler: controller.postInvoiceAccountAddress,
  options: {
    description: 'Adds an address to an invoice account entity',
    validate: {
      params: Joi.object().keys({
        invoiceAccountId: validators.GUID
      }),
      payload: Joi.object().keys({
        addressId: validators.GUID,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        agentCompanyId: validators.GUID.allow(null).default(null),
        contactId: validators.GUID.allow(null).default(null),
        isTest: validators.TEST_FLAG
      })
    }
  }
}

exports.deleteInvoiceAccountAddress = {
  method: 'DELETE',
  path: '/crm/2.0/invoice-account-addresses/{invoiceAccountAddressId}',
  handler: controller.deleteInvoiceAccountAddress,
  options: {
    description: 'Delete an invoice account address entity by id',
    validate: {
      params: Joi.object().keys({
        invoiceAccountAddressId: validators.GUID
      })
    }
  }
}

exports.patchInvoiceAccountAddress = {
  method: 'PATCH',
  path: '/crm/2.0/invoice-account-addresses/{invoiceAccountAddressId}',
  handler: controller.patchInvoiceAccountAddress,
  options: {
    description: 'Update an existing invoice account address',
    validate: {
      params: Joi.object().keys({
        invoiceAccountAddressId: validators.GUID
      }),
      payload: Joi.object().keys({
        endDate: validators.NULLABLE_DATE
      })
    }
  }
}
