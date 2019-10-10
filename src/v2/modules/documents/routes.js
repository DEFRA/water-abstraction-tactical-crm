const Joi = require('@hapi/joi');
const controller = require('./controller');

exports.getDocument = {
  method: 'GET',
  path: `/crm/2.0/documents/{documentId}`,
  handler: controller.getDocument,
  options: {
    description: 'Get document with roles',
    validate: {
      params: {
        documentId: Joi.string().guid().required()
      }
    }
  }
};

exports.getDocuments = {
  method: 'GET',
  path: `/crm/2.0/documents`,
  handler: controller.getDocuments,
  options: {
    description: 'Get all documents for a licence number',
    validate: {
      query: {
        regime: Joi.string().default('water'),
        documentType: Joi.string().default('abstraction_licence'),
        documentRef: Joi.string().required()
      }
    }
  }
};
