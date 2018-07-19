const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    table: 'crm.entity_roles',
    primaryKey: 'entity_role_id',
    endpoint: '/crm/' + version + '/entity/{entity_id}/roles',
    connection: pool,
    preQuery: (result, hapiRequest) => {
      result.filter.entity_id = hapiRequest.params.entity_id;
      result.data.entity_id = hapiRequest.params.entity_id;
      return result;
    },
    validation: {
      entity_role_id: Joi.string().guid(),
      entity_id: Joi.string().guid(),
      role: Joi.string(),
      regime_entity_id: Joi.string().guid(),
      company_entity_id: Joi.string().guid(),
      created_by: Joi.string(),
      permissions: Joi.object().allow(null)
    }
  });
};
