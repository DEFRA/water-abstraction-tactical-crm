const Joi = require('@hapi/joi');
const controller = require('./controller');
const validators = require('../../lib/validators');
const entityHandlers = require('../../lib/entity-handlers');

exports.getDocument = {
  method: 'GET',
  path: '/crm/2.0/documents/{documentId}',
  handler: request => entityHandlers.getEntity(request, 'document'),
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
  path: '/crm/2.0/documents',
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

exports.postDocument = {
  method: 'POST',
  path: '/crm/2.0/documents',
  handler: (request, h) => entityHandlers.createEntity(request, h, 'document'),
  options: {
    description: 'Add a document for a licence number',
    validate: {
      payload: {
        regime: Joi.string().required().valid('water'),
        documentType: Joi.string().required().valid('abstraction_licence'),
        versionNumber: Joi.number().integer().required().min(0),
        documentRef: Joi.string().required(),
        status: Joi.string().required().valid('current', 'draft', 'superseded'),
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: Joi.boolean().default(false)
      }
    }
  }
};
