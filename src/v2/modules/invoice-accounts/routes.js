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
      query: {
        ids: Joi.array().single().items(validators.GUID).required()
      }
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
      payload: {
        companyId: validators.GUID,
        invoiceAccountNumber: Joi.string().regex(/^[ABENSTWY][0-9]{8}A$/).required(),
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.postInvoiceAccountAddress = {
  method: 'POST',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}/addresses',
  handler: (request, h) => entityHandlers.addEntity(request, h, 'invoiceAccount', 'address'),
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
        isTest: validators.TEST_FLAG
      }
    }
  }
};
