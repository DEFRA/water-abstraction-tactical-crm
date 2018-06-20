const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    table: 'crm.entity_roles',
    primaryKey: 'entity_role_id',
    endpoint: '/crm/' + version + '/role_entities',
    connection: pool,
    validation: {
      entity_role_id: Joi.string().guid(),
      entity_id: Joi.string().guid(),
      role: Joi.string(),
      regime_entity_id: Joi.string().guid(),
      company_entity_id: Joi.string().guid(),
      is_primary: Joi.number(),
      created_by: Joi.string()
    }
  });
};
