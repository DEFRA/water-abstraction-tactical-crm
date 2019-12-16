const Joi = require('@hapi/joi');
const controller = require('./controller');

exports.getCompanies = {
  method: 'GET',
  path: '/crm/2.0/companies',
  handler: controller.getCompanies,
  options: {
    validate: {
      query: {
        invoiceAccountIds: Joi.string()
      }
    }
  }
};
