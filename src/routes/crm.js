/*
API operations only - NO UI
*/
const version = '1.0';
const CRM = require('../lib/CRM');
const Joi = require('joi');

const documentsRoutes = Object.values(require('./documents'));

const EntityApi = require('../controllers/entities.js');
const VerificationApi = require('../controllers/verifications.js');
const DocumentHeaderApi = require('../controllers/document-headers.js');
const DocumentEntitiesApi = require('../controllers/document-entities.js');
const EntityRolesApi = require('../controllers/entity-roles.js');
const RoleEntityView = require('../controllers/role-entities-view.js');
const RolesApi = require('../controllers/roles.js');
const VerificationDocumentsController = require('../controllers/verification-documents.js');
const { getContacts, getDocumentsForContact } = require('../controllers/contacts');
const { getVerificationsByDocumentID } = require('../controllers/verifications-by-document.js');
const KpiApi = require('../controllers/kpi-reports.js');

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

  // Get entities
  EntityApi.findOneRoute(),
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
    path: '/crm/' + version + '/entity/{entity_id}/verifications',
    handler: VerificationDocumentsController.getUserVerifications,
    options: {
      description: 'Get the companies that a user entity is associated with',
      validate: {
        params: {
          entity_id: Joi.string().guid().required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/crm/' + version + '/entity/{entity_id}/companies',
    handler: EntityApi.getEntityCompanies,
    options: {
      description: 'Get the companies that a user entity is associated with',
      validate: {
        params: {
          entity_id: Joi.string().guid().required()
        }
      }
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
      description: 'Remove specified colleague of entity',
      validate: {
        params: {
          entity_id: Joi.string().guid().required(),
          role_id: Joi.string().guid().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/crm/' + version + '/entity/{entity_id}/colleagues',
    handler: CRM.createColleague,
    options: {
      description: 'Create new colleague of entity',
      validate: {
        payload: {
          colleagueEntityID: Joi.string().uuid().required(),
          role: Joi.string().required().valid('user', 'user_returns').default('user')
        }
      }
    }
  },

  // Document header
  ...DocumentHeaderApi.getRoutes(),
  ...DocumentEntitiesApi.getRoutes(),

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
    method: 'DELETE',
    path: '/crm/' + version + '/verification/{id}/documents',
    handler: VerificationDocumentsController.deleteVerificationDocuments,
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
    path: '/crm/' + version + '/contacts/{entity_id}/documents',
    handler: getDocumentsForContact
  },
  {
    method: 'GET',
    path: '/crm/' + version + '/document_verifications',
    handler: getVerificationsByDocumentID
  },
  KpiApi.findManyRoute(),

  ...Object.values(documentsRoutes)
];
