/*

API operations only - NO UI

*/

const version = '1.0'

const CRM = require('../lib/CRM')
const Joi = require('joi');
const Helpers = require('../lib/helpers');
// const Pool
// const HAPIRestAPI = require('../lib/rest-api');
const HAPIRestAPI = require('hapi-pg-rest-api');

const {
  pool
} = require('../lib/connectors/db.js');
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
const RoleEntityApi = require('../controllers/role-entities.js')(apiConfig);
const RoleEntityView = require('../controllers/role-entities-view.js')(apiConfig);
const RolesApi = require('../controllers/roles.js')(apiConfig);
const VerificationDocumentsController = require('../controllers/verification-documents.js')
const { getContacts } = require('../controllers/contacts');
const { getVerificationsByDocumentID } = require('../controllers/verifications-by-document.js');
const KpiApi = require('../controllers/kpi-reports.js')(apiConfig);

module.exports = [{
    method: 'GET',
    path: '/status',
    handler: function(request, reply) {
      return reply('ok').code(200)
    },
    config: {
      auth: false,
      description: 'Get all entities'
    }
  },

  // Get all entities
  EntityApi.getRoutes()[0],

  // Update entity
  EntityApi.getRoutes()[3],

  // Create new entity
  EntityApi.getRoutes()[2],

  // Put entity (not implemented)
  EntityApi.getRoutes()[4],

  // Delete entity
  EntityApi.getRoutes()[5],

  ...RolesApi.getRoutes(),
  ...RoleEntityApi.getRoutes(),
  RoleEntityView.findManyRoute(),
  RoleEntityView.findOneRoute(),




  {
    method: 'GET',
    path: '/crm/' + version + '/entity/{entity_id}',
    handler: CRM.getEntity,
    config: {
      description: 'Get specified entity'
    }
  },

  {
    method: 'GET',
    path: '/crm/' + version + '/entity/{entity_id}/colleagues',
    handler: CRM.getColleagues,
    config: {
      description: 'Get colleagues of entity'
    }
  },
  {
    method: 'DELETE',
    path: '/crm/' + version + '/entity/{entity_id}/colleagues/{role_id}',
    handler: CRM.deleteColleague,
    config: {
      description: 'Remove specified colleague of entity'
    }
  },
  {
    method: 'POST',
    path: '/crm/' + version + '/entity/{entity_id}/colleagues',
    handler: CRM.createColleague,
    config: {
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
    config: {
      description: 'Search for document headers by posted filter criteria'
    }
  },
  {
    method: 'PUT',
    path: '/crm/' + version + '/documentHeader/{document_id}/owner',
    handler: CRM.setDocumentOwner,
    config: {
      description: 'Search for document headers by posted filter criteria'
    }
  },

  ...EntityRolesApi.getRoutes(),
  ...VerificationApi.getRoutes(),

  {
    method: 'POST',
    path: '/crm/' + version + '/verification/{id}/documents',
    handler: VerificationDocumentsController.postVerificationDocuments,
    config: {
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
    config: {
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
]

