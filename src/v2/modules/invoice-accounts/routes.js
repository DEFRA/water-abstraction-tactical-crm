const Joi = require('@hapi/joi');
const controller = require('./controller');

const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators');

exports.getInvoiceAccount = {
  method: 'GET',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}',
  handler: request => entityHandlers.getEntity(request, 'invoiceAccount'),
  options: {
    description: 'Get an invoice account by id',
    validate: {
      params: {
        invoiceAccountId: validators.GUID
      }
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
      params: {
        invoiceAccountId: validators.GUID
      }
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
