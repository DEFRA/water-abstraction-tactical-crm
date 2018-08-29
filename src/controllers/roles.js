const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { version } = require('../../config');
const { pool } = require('../lib/connectors/db');

const rolesApi = new HAPIRestAPI({
  table: 'crm.roles',
  primaryKey: 'role_id',
  endpoint: '/crm/' + version + '/roles',
  connection: pool,
  validation: {
    role_id: Joi.string(),
    role_nm: Joi.string()
  }
});

module.exports = rolesApi;
