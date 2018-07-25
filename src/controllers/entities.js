const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const { pool, version } = config;
  return new HAPIRestAPI({
    name: 'entities',
    table: 'crm.entity',
    primaryKey: 'entity_id',
    endpoint: '/crm/' + version + '/entity',
    connection: pool,
    validation: {
      entity_id: Joi.string().guid(),
      entity_nm: [Joi.string().trim().email().lowercase(), Joi.string().trim()],
      entity_type: Joi.string(),
      entity_definition: Joi.string(),
      source: Joi.string()
    }
  });
};
