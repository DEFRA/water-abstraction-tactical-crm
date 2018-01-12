const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    table : 'crm.document_header',
    primaryKey : 'document_id',
    endpoint : '/crm/' + version + '/documentHeader',
    connection : pool,
    validation : {
      document_id : Joi.string().guid(),
      regime_entity_id : Joi.string().guid(),
      system_id : Joi.string(),
      system_internal_id : Joi.string(),
      system_external_id : Joi.string(),
      metadata : Joi.string(),
      company_entity_id : Joi.string().guid(),
      verified : Joi.number().allow(null),
      verification_id : Joi.string().guid().allow(null)
    }
  });
}
