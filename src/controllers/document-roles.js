const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    table: 'crm.role_document_access',
    primaryKey: 'entity_role_id',
    endpoint: '/crm/' + version + '/document_role_access',
    connection: pool,
    validation: {
      entity_role_id: Joi.string().guid(),
      role: Joi.string(),
      system_external_id: Joi.string(),
      filter: Joi.object(),
      sort: Joi.object(),
      pagination: Joi.object()
    }
  });
};
