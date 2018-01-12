/*

API operations only - NO UI

*/

const version = '1.0'

const CRM = require('../lib/CRM')
const Joi = require('joi');
const Helpers = require('../lib/helpers');

const HAPIRestAPI = require('../lib/rest-api');


const VerificationApi = new HAPIRestAPI({
  table : 'crm.verification',
  primaryKey : 'verification_id',
  endpoint : '/crm/' + version + '/verification',
  onCreateTimestamp : 'date_created',
  validation : {
    verification_id : Joi.string().guid(),
    entity_id : Joi.string().guid(),
    company_entity_id : Joi.string().guid(),
    verification_code : Joi.string(),
    date_verified : Joi.string(),
    date_created : Joi.string(),
    method : Joi.string()
  },
  preInsert : (data) => {
    return Object.assign({
      verification_code : Helpers.createShortCode()}, data);
  }
});


const DocumentHeaderApi = new HAPIRestAPI({
  table : 'crm.document_header',
  primaryKey : 'document_id',
  endpoint : '/crm/' + version + '/documentHeader',
  validation : {
    document_id : Joi.string().guid(),
    regime_entity_id : Joi.string().guid(),
    system_id : Joi.string(),
    system_internal_id : Joi.string(),
    system_external_id : Joi.string(),
    metadata : Joi.string(),
    company_entity_id : Joi.string().guid(),
    verified : Joi.number(),
    verification_id : Joi.string().guid()
  }
});




module.exports = [
  { method: 'GET', path: '/status', handler: function(request,reply){return reply('ok').code(200)}, config:{auth: false,description:'Get all entities'}},
  { method: 'GET', path: '/crm/' + version + '/entity', handler: CRM.getAllEntities, config:{description:'Get all entities'} },


  {  method: 'POST', path: '/crm/' + version + '/entity', handler: CRM.createNewEntity , config:{description:'Create new entity'}},
  {  method: 'GET', path: '/crm/' + version + '/entity/{entity_id}', handler: CRM.getEntity ,config:{description:'Get specified entity'}},
  {  method: 'GET', path: '/crm/' + version + '/entity/{entity_id}/colleagues', handler: CRM.getColleagues ,config:{description:'Get colleagues of entity'}},
  {  method: 'DELETE', path: '/crm/' + version + '/entity/{entity_id}/colleagues/{role_id}', handler: CRM.deleteColleague ,config:{description:'Remove specified colleague of entity'}},
  {  method: 'POST', path: '/crm/' + version + '/entity/{entity_id}/colleagues', handler: CRM.createColleague ,config:{description:'Create new colleague of entity'}},
  {  method: 'PUT', path: '/crm/' + version + '/entity/{entity_id}', handler: CRM.updateEntity, config:{description:'Update specified entity'} },
  {  method: 'DELETE', path: '/crm/' + version + '/entity/{entity_id}', handler: CRM.deleteEntity ,config:{description:'Delete specified'}},
  {  method: 'GET', path: '/crm/' + version + '/entityAssociation', handler: CRM.getEntityAssociations ,config:{description:'Get associations for specified entity'}},
  {  method: 'POST', path: '/crm/' + version + '/entityAssociation', handler: CRM.createEntityAssociation ,config:{description:'Add association for specified entity'}},
  {  method: 'GET', path: '/crm/' + version + '/entityAssociation/{entity_association_id}', handler: CRM.getEntityAssociation ,config:{description:'Get specified association'}},
  {  method: 'PUT', path: '/crm/' + version + '/entityAssociation/{entity_association_id}', handler: CRM.updateEntityAssociation ,config:{description:'Update specified association'}},
  {  method: 'DELETE', path: '/crm/' + version + '/entityAssociation/{entity_association_id}', handler: CRM.deleteEntityAssociation ,config:{description:'Delete specified association'}},



  DocumentHeaderApi.getRoutes()[0],
  // {  method: 'GET', path: '/crm/' + version + '/documentHeader', handler: CRM.getDocumentHeaders ,config:{description:'Get all document headers'}},

  {  method: 'POST', path: '/crm/' + version + '/documentHeader', handler: CRM.createDocumentHeader ,config:{description:'Create new document header'}},


  {  method: 'GET', path: '/crm/' + version + '/documentHeader/{document_id}/entity/{entity_id}/name', handler: CRM.getDocumentNameForUser ,config:{description:'Get custom name for document'}},
  {  method: 'POST', path: '/crm/' + version + '/documentHeader/{document_id}/entity/{entity_id}/name', handler: CRM.setDocumentNameForUser ,config:{description:'Set custom name for document'}},
  {  method: 'PATCH', path: '/crm/' + version + '/documentHeaders', handler: CRM.updateDocumentHeaders, config : {
    description: 'Bulk update a set of document headers based on supplied query conditions',
    validate: {
      payload : {
        query : {
          verification_id : Joi.string().guid(),
          document_id : Joi.array()
        },
        set : {
          verification_id : Joi.string().guid(),
          verified : Joi.number(),
          company_entity_id : Joi.string().guid()
        }
      }
    }
  }},
  {  method: 'GET', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.getDocumentHeader ,config:{description:'Get specified document header by document id'}},
  {  method: 'GET', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.getDocumentHeader ,config:{description:'Get specified document header by external system & external system document id'}},
  {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.updateDocumentHeader ,config:{description:'Update specified document header by document id'}},
  {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.updateDocumentHeader, config:{description:'Update specified document header by external system & external system document id'} },
  {  method: 'DELETE', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.deleteDocumentHeader ,config:{description:'Delete specified document header by document id'}},
  {  method: 'DELETE', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.deleteDocumentHeader ,config:{description:'Delete specified document header by external system & external system document id'}},
  {  method: 'POST', path: '/crm/' + version + '/documentHeader/filter', handler: CRM.getRoleDocuments ,config:{description:'Search for document headers by posted filter criteria'}},
  {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{document_id}/owner', handler: CRM.setDocumentOwner ,config:{description:'Search for document headers by posted filter criteria'}},
  {  method: 'POST', path: '/crm/' + version + '/entity/{entity_id}/roles', handler: CRM.addEntityRole ,config:{description:'Add role to specified entity'}},
  {  method: 'GET', path: '/crm/' + version + '/entity/{entity_id}/roles', handler: CRM.getEntityRoles ,config:{description:'Get roles for specified entity'}},
  {  method: 'DELETE', path: '/crm/' + version + '/entity/{entity_id}/roles/{role_id}', handler: CRM.deleteEntityRole ,config:{description:'Delete role from specified entity'}},


  ...VerificationApi.getRoutes(),


]
