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
  preInsert : (data) => {
    return Object.assign({
      verification_code : Helpers.createShortCode()}, data);
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
  {  method: 'GET', path: '/crm/' + version + '/documentHeader', handler: CRM.getDocumentHeaders ,config:{description:'Get all document headers'}},
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
  {  method: 'POST', path: '/crm/' + version + '/documentHeader/filter', handler: CRM.getDocumentHeaders ,config:{description:'Search for document headers by posted filter criteria'}},
  {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{document_id}/owner', handler: CRM.setDocumentOwner ,config:{description:'Search for document headers by posted filter criteria'}},
  {  method: 'POST', path: '/crm/' + version + '/entity/{entity_id}/roles', handler: CRM.addEntityRole ,config:{description:'Add role to specified entity'}},
  {  method: 'GET', path: '/crm/' + version + '/entity/{entity_id}/roles', handler: CRM.getEntityRoles ,config:{description:'Get roles for specified entity'}},
  {  method: 'DELETE', path: '/crm/' + version + '/entity/{entity_id}/roles/{role_id}', handler: CRM.deleteEntityRole ,config:{description:'Delete role from specified entity'}},


  ...VerificationApi.getRoutes(),

  // {  method: 'POST', path: '/crm/' + version + '/verification', handler: CRM.createNewVerification ,config:{
  //   description:'Create new verification for user/company combination',
  //   validate: {
  //     payload : {
  //       entity_id : Joi.string().required().guid(),
  //       company_entity_id : Joi.string().required().guid(),
  //       method : Joi.string().required().regex(/^post|phone$/)
  //     }
  //   }}},
  //   {  method: 'PATCH', path: '/crm/' + version + '/verification/{verification_id}', handler: CRM.updateVerification ,config:{
  //     description:'Set the date_verified timestamp for the specified verification record',
  //     validate: {
  //       params : {
  //         verification_id : Joi.string().required().guid()
  //       },
  //       payload : {
  //         date_verified : Joi.string().required()
  //       }
  //     }}},



      {  method: 'POST', path: '/crm/' + version + '/verification/check', handler: CRM.checkVerificationCode ,config:{
        description:'Checks a verification code',
        validate: {
          payload : {
            entity_id : Joi.string().required().guid(),
            company_entity_id : Joi.string().required().guid(),
            verification_code: Joi.string().required()
          }
        }}}

,





]
