const Joi = require('joi');
const controller = require('./controller');
const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators-v2');

exports.getInvoiceAccount = {
  method: 'GET',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}',
  handler: request => entityHandlers.getEntity(request, 'invoiceAccount'),
  options: {
    description: 'Get an invoice account by id',
    validate: {
      params: Joi.object().keys({
        invoiceAccountId: validators.GUID
      })
    }
  }
};

exports.getInvoiceAccountByRef = {
  method: 'GET',
  path: '/crm/2.0/invoice-account',
  handler: controller.getInvoiceAccountByRef,
  options: {
    description: 'Get an invoice account by ref',
    validate: {
      query: Joi.object({
        ref: validators.REQUIRED_INVOICE_ACCOUNT_NUMBER
      })
    }
  }
};

exports.getInvoiceAccounts = {
  method: 'GET',
  path: '/crm/2.0/invoice-accounts',
  handler: controller.getInvoiceAccounts,
  options: {
    description: 'Get a list of invoice accounts by id',
    validate: {
      query: Joi.object({
        id: Joi.array().single().items(validators.GUID).required()
      }).rename('id[]', 'id', { ignoreUndefined: true })
    }
  }
};

exports.createInvoiceAccount = {
  method: 'POST',
  path: '/crm/2.0/invoice-accounts',
  handler: (request, h) => entityHandlers.createEntity(request, h, 'invoiceAccount'),
  options: {
    description: 'Creates an invoice account',
    validate: {
      payload: Joi.object({
        companyId: validators.GUID,
        invoiceAccountNumber: validators.INVOICE_ACCOUNT_NUMBER,
        regionCode: validators.REGION_CODE,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      }).xor('invoiceAccountNumber', 'regionCode')
    }
  }
};

exports.deleteInvoiceAccount = {
  method: 'DELETE',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}',
  handler: (request, h) => entityHandlers.deleteEntity(request, h, 'invoiceAccount'),
  options: {
    description: 'Delete an invoice account entity by id',
    validate: {
      params: Joi.object().keys({
        invoiceAccountId: validators.GUID
      })
    }
  }
};

exports.getInvoiceAccountsWithRecentlyUpdatedEntities = {
  method: 'GET',
  path: '/crm/2.0/invoice-accounts/recently-updated',
  handler: controller.getInvoiceAccountsWithRecentlyUpdatedEntities,
  options: {
    description: 'Get all invoice accounts whose underlying entities have unmatching current_hash vs last_hash'
  }
};

exports.updateInvoiceAccountsWithCustomerFileReference = {
  method: 'POST',
  path: '/crm/2.0/invoice-accounts/customer-file-references',
  handler: controller.updateInvoiceAccountsWithCustomerFileReference,
  options: {
    description: 'Updates invoice accounts with customer file names fetched from the Charging Module',
    validate: {
      payload: Joi.object({
        fileReference: validators.REQUIRED_STRING,
        exportedAt: validators.DATE,
        exportedCustomers: Joi.array().items(Joi.string())
      })
    }
  }
};
