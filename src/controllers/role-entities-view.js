const HAPIRestAPI = require('@envage/hapi-pg-rest-api');
const Joi = require('joi');
const { version } = require('../../config');
const { pool } = require('../lib/connectors/db');

const entityRolesViewApi = new HAPIRestAPI({
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

module.exports = entityRolesViewApi;
