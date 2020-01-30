const Joi = require('@hapi/joi');
const controller = require('./controller');

exports.getInvoiceAccount = {
  method: 'GET',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}',
  handler: controller.getInvoiceAccount,
  options: {
    description: 'Get an invoice account by id',
    validate: {
      params: {
        invoiceAccountId: Joi.string().guid().required()
      }
    }
  }
};

exports.getInvoiceAccounts = {
  method: 'GET',
  path: '/crm/2.0/invoice-accounts',
  handler: controller.getInvoiceAccounts,
  options: {
    description: 'Get a list of invoice accounts that have the speicified id values',
    validate: {
      query: {
        id: Joi.array().single().items(Joi.string().uuid()).required()
      }
    }
  }
};
