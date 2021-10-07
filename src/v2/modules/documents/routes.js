const Joi = require('joi');
const controller = require('./controller');
const validators = require('../../lib/validators-v2');
const entityHandlers = require('../../lib/entity-handlers');

exports.getDocument = {
  method: 'GET',
  path: '/crm/2.0/documents/{documentId}',
  handler: request => entityHandlers.getEntity(request, 'document'),
  options: {
    description: 'Get document with roles',
    validate: {
      params: Joi.object().keys({
        documentId: Joi.string().guid().required()
      })
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
      query: Joi.object().keys({
        regime: Joi.string().default('water'),
        documentType: Joi.string().default('abstraction_licence'),
        documentRef: Joi.string().required()
      })
    }
  }
};

exports.getDocumentByRefAndDate = {
  method: 'GET',
  path: '/crm/2.0/documents/search',
  handler: controller.getDocumentByRefAndDate,
  options: {
    description: 'Get single document for a licence number on a particular date with roles',
    validate: {
      query: Joi.object().keys({
        regime: Joi.string().default('water'),
        documentType: Joi.string().default('abstraction_licence'),
        documentRef: Joi.string().required(),
        date: validators.DATE
      })
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
      payload: Joi.object().keys({
        regime: Joi.string().required(),
        documentType: Joi.string().required(),
        documentRef: Joi.string().required(),
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      })
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
      params: Joi.object().keys({
        documentId: validators.GUID
      }),
      payload: Joi.object().keys({
        role: Joi.string().valid('billing', 'licenceHolder').required(),
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        invoiceAccountId: Joi.string().uuid().allow(null),
        companyId: Joi.string().uuid().allow(null),
        contactId: Joi.string().uuid().allow(null),
        addressId: Joi.string().uuid().allow(null),
        isTest: validators.TEST_FLAG
      })
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
      params: Joi.object().keys({
        documentRoleId: validators.GUID
      })
    }
  }
};
