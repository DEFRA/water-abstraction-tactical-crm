const HAPIRestAPI = require('@envage/hapi-pg-rest-api');
const Joi = require('joi');
const { createShortCode } = require('../lib/helpers.js');
const { version } = require('../../config');
const { pool } = require('../lib/connectors/db');

const verificationsApi = new HAPIRestAPI({
  table: 'crm.verification',
  primaryKey: 'verification_id',
  endpoint: '/crm/' + version + '/verification',
  onCreateTimestamp: 'date_created',
  connection: pool,
  validation: {
    verification_id: Joi.string().guid(),
    entity_id: Joi.string().guid(),
    company_entity_id: Joi.string().guid(),
    verification_code: Joi.string(),
    date_verified: Joi.string().allow(null),
    date_created: Joi.string(),
    method: Joi.string()
  },
  preInsert: (data) => {
    return Object.assign({
      verification_code: createShortCode()}, data);
  }
});

module.exports = verificationsApi;
