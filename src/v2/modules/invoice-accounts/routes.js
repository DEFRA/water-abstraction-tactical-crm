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

exports.postInvoiceAccountAddress = {
  method: 'POST',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}/addresses',
  handler: (request, h) => entityHandlers.createEntity(request, h, 'invoiceAccountAddress'),
  options: {
    description: 'Adds an address to an invoice account entity',
    validate: {
      params: {
        invoiceAccountId: validators.GUID
      },
      payload: {
        addressId: validators.GUID,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        agentCompanyId: validators.GUID.allow(null).default(null),
        contactId: validators.GUID.allow(null).default(null),
        isTest: validators.TEST_FLAG
      }
    }
  }
};
