const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { version } = require('../../config');
const { pool } = require('../lib/connectors/db');

const documentEntitiesApi = new HAPIRestAPI({
  table: 'crm.document_entity',
  primaryKey: 'document_entity_id',
  endpoint: '/crm/' + version + '/document/{document_id}/entities',
  connection: pool,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
  preQuery: (result, hapiRequest) => {
    result.filter.document_id = hapiRequest.params.document_id;
    result.data.document_id = hapiRequest.params.document_id;
    return result;
  },
  validation: {
    document_entity_id: Joi.string().guid(),
    entity_id: Joi.string().guid(),
    role: Joi.string(),
    document_id: Joi.string().guid(),
    created_at: Joi.string(),
    modified_at: Joi.string()
  },
  showSql: true
});

module.exports = documentEntitiesApi;
