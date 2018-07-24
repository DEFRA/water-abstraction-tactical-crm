const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    name: 'entityRolesView',
    table: 'crm.entity_roles_view',
    primaryKey: 'entity_role_id',
    endpoint: '/crm/' + version + '/role_entities_view',
    connection: pool,
    validation: {
      entity_id: Joi.string(),
      role_id: Joi.string(),
      role_nm: Joi.string(),
      entity_nm: Joi.string(),
      entity_type: Joi.string(),
      regime_entity_id: Joi.string(),
      company_entity_id: Joi.string(),
      role: Joi.string()
    }
  });
};
