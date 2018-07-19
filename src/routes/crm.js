/*
API operations only - NO UI
*/
const version = '1.0';
const CRM = require('../lib/CRM');
const Joi = require('joi');

const { pool } = require('../lib/connectors/db.js');
const apiConfig = {
  pool,
  version
};
const EntityApi = require('../controllers/entities.js')(apiConfig);
const VerificationApi = require('../controllers/verifications.js')(apiConfig);
const DocumentHeaderApi = require('../controllers/document-headers.js')(apiConfig);
const DocumentRolesApi = require('../controllers/document-roles.js')(apiConfig);
const DocumentEntitiesApi = require('../controllers/document-entities.js')(apiConfig);
const EntityRolesApi = require('../controllers/entity-roles.js')(apiConfig);
const RoleEntityView = require('../controllers/role-entities-view.js')(apiConfig);
const RolesApi = require('../controllers/roles.js')(apiConfig);
const VerificationDocumentsController = require('../controllers/verification-documents.js');
const { getContacts } = require('../controllers/contacts');
const { getVerificationsByDocumentID } = require('../controllers/verifications-by-document.js');
const KpiApi = require('../controllers/kpi-reports.js')(apiConfig);

module.exports = [
  {
    method: 'GET',
    path: '/status',
    handler: () => 'ok',
    options: {
      auth: false,
      description: 'Get all entities'
    }
  },

  // Get all entities
  EntityApi.findManyRoute(),

  // Update entity
  EntityApi.updateOneRoute(),

  // Create new entity
  EntityApi.createRoute(),

  // Put entity (not implemented)
  EntityApi.replaceOneRoute(),

  // Delete entity
  EntityApi.deleteOneRoute(),

  ...RolesApi.getRoutes(),
  RoleEntityView.findManyRoute(),
  RoleEntityView.findOneRoute(),
  {
    method: 'GET',
    path: '/crm/' + version + '/entity/{entity_id}',
    handler: CRM.getEntity,
    options: {
      description: 'Get specified entity'
    }
  },

  {
    method: 'GET',
    path: '/crm/' + version + '/entity/{entity_id}/colleagues',
    handler: CRM.getColleagues,
    options: {
      description: 'Get colleagues of entity'
    }
  },
  {
    method: 'DELETE',
    path: '/crm/' + version + '/entity/{entity_id}/colleagues/{role_id}',
    handler: CRM.deleteColleague,
    options: {
      description: 'Remove specified colleague of entity'
    }
  },
  {
    method: 'POST',
    path: '/crm/' + version + '/entity/{entity_id}/colleagues',
    handler: CRM.createColleague,
    options: {
      description: 'Create new colleague of entity'
    }
  },

  // Document header
  ...DocumentHeaderApi.getRoutes(),
  ...DocumentRolesApi.getRoutes(),
  ...DocumentEntitiesApi.getRoutes(),

  {
    method: 'POST',
    path: '/crm/' + version + '/documentHeader/filter',
    handler: CRM.getRoleDocuments,
    options: {
      description: 'Search for document headers by posted filter criteria'
    }
  },
  {
    method: 'PUT',
    path: '/crm/' + version + '/documentHeader/{document_id}/owner',
    handler: CRM.setDocumentOwner,
    options: {
      description: 'Search for document headers by posted filter criteria'
    }
  },

  ...EntityRolesApi.getRoutes(),
  ...VerificationApi.getRoutes(),

  {
    method: 'POST',
    path: '/crm/' + version + '/verification/{id}/documents',
    handler: VerificationDocumentsController.postVerificationDocuments,
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        payload: {
          document_id: Joi.array().items(Joi.string().guid()).required()
        }
      }
    }
  },

  {
    method: 'GET',
    path: '/crm/' + version + '/verification/{id}/documents',
    handler: VerificationDocumentsController.getVerificationDocuments,
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/crm/' + version + '/contacts',
    handler: getContacts
  },
  {
    method: 'GET',
    path: '/crm/' + version + '/document_verifications',
    handler: getVerificationsByDocumentID
  },
  KpiApi.findManyRoute()
];
