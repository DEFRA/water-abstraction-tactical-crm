const HAPIRestAPI = require('@envage/hapi-pg-rest-api')
const Joi = require('joi')
const { version } = require('../../config')
const { pool } = require('../lib/connectors/db')

const entityRolesApi = new HAPIRestAPI({
  table: 'crm.entity_roles',
  name: 'entityRoles',
  primaryKey: 'entity_role_id',
  endpoint: '/crm/' + version + '/entity/{entity_id}/roles',
  connection: pool,
  preQuery: (result, hapiRequest) => {
    result.filter.entity_id = hapiRequest.params.entity_id
    result.data.entity_id = hapiRequest.params.entity_id
    return result
  },
  validation: {
    entity_role_id: Joi.string().guid(),
    entity_id: Joi.string().guid(),
    role: Joi.string(),
    regime_entity_id: Joi.string().guid(),
    company_entity_id: Joi.string().guid(),
    created_by: Joi.string()
  }
})

module.exports = entityRolesApi
