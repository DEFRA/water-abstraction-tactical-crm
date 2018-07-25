const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { createShortCode } = require('../lib/helpers.js');

module.exports = (config = {}) => {
  const {version, pool} = config;
  return new HAPIRestAPI({
    name: 'verifications',
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
};
