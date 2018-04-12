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
const EntityRolesApi = require('../controllers/entity-roles.js')(apiConfig);
const RoleEntityApi = require('../controllers/role-entities.js')(apiConfig);
const RoleEntityView = require('../controllers/role-entities-view.js')(apiConfig);
const RolesApi = require('../controllers/roles.js')(apiConfig);
const VerificationDocumentsController = require('../controllers/verification-documents.js')



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

  // DocumentHeaderApi.getRoutes()[0],
  // {  method: 'POST', path: '/crm/' + version + '/documentHeader', handler: CRM.createDocumentHeader ,config:{description:'Create new document header'}},

  // {
  //   method: 'GET',
  //   path: '/crm/' + version + '/documentHeader/{document_id}/entity/{entity_id}/name',
  //   handler: CRM.getDocumentNameForUser,
  //   config: {
  //     description: 'Get custom name for document'
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/crm/' + version + '/documentHeader/{document_id}/entity/{entity_id}/name',
  //   handler: CRM.setDocumentNameForUser,
  //   config: {
  //     description: 'Set custom name for document'
  //   }
  // },


  // Document header
  ...DocumentHeaderApi.getRoutes(),

  ...DocumentRolesApi.getRoutes(),

  // {  method: 'GET', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.getDocumentHeader ,config:{description:'Get specified document header by document id'}},
  // {  method: 'GET', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.getDocumentHeader ,config:{description:'Get specified document header by external system & external system document id'}},

  // Update doc header - PUT
  // DocumentHeaderApi.getRoutes()[3],

  // {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.updateDocumentHeader ,config:{description:'Update specified document header by document id'}},
  // {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.updateDocumentHeader, config:{description:'Update specified document header by external system & external system document id'} },
  // {  method: 'DELETE', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.deleteDocumentHeader ,config:{description:'Delete specified document header by document id'}},
  // {  method: 'DELETE', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.deleteDocumentHeader ,config:{description:'Delete specified document header by external system & external system document id'}},
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


  //
  // {  method: 'POST', path: '/crm/' + version + '/entity/{entity_id}/roles', handler: CRM.addEntityRole ,config:{description:'Add role to specified entity'}},
  // {  method: 'GET', path: '/crm/' + version + '/entity/{entity_id}/roles', handler: CRM.getEntityRoles ,config:{description:'Get roles for specified entity'}},
  // {  method: 'DELETE', path: '/crm/' + version + '/entity/{entity_id}/roles/{role_id}', handler: CRM.deleteEntityRole ,config:{description:'Delete role from specified entity'}},
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
  }


]
