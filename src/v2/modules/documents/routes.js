const Joi = require('@hapi/joi');
const controller = require('./controller');
const validators = require('../../lib/validators');

exports.getDocument = {
  method: 'GET',
  path: '/crm/2.0/documents/{documentId}',
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

exports.postDocuments = {
  method: 'POST',
  path: '/crm/2.0/documents',
  handler: controller.postDocuments,
  options: {
    description: 'Add a document for a licence number',
    validate: {
      payload: {
        regime: validators.REGIME,
        documentType: validators.DOC_TYPE,
        versionNumber: validators.VERSION,
        documentRef: validators.REQUIRED_STRING,
        status: validators.DOC_STATUS,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: true
      }
    }
  }
};
