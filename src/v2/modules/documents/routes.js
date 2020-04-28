const Joi = require('@hapi/joi');
const controller = require('./controller');
const entityHandlers = require('../../lib/entity-handlers');
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

exports.postDocumentRole = {
  method: 'POST',
  path: '/crm/2.0/documents/{documentId}/roles',
  handler: async (request, h) => entityHandlers.createEntity(
    request,
    h,
    'documentRole',
    documentRole => `/crm/2.0/document-roles/${documentRole.documentRoleId}`
  ),
  options: {
    description: 'Creates a new document role',
    validate: {
      params: {
        documentId: validators.GUID
      },
      payload: {
        role: Joi.string().valid('billing', 'licenceHolder').required(),
        isDefault: Joi.boolean().optional().default(false),
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        invoiceAccountId: Joi.string().uuid().allow(null),
        companyId: Joi.string().uuid().allow(null),
        contactId: Joi.string().uuid().allow(null),
        addressId: Joi.string().uuid().allow(null),
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.getDocumentRole = {
  method: 'GET',
  path: '/crm/2.0/document-roles/{documentRoleId}',
  handler: async request => entityHandlers.getEntity(request, 'documentRole'),
  options: {
    description: 'Get a document role entity',
    validate: {
      params: {
        documentRoleId: validators.GUID
      }
    }
  }
};
