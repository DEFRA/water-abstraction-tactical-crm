const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { get } = require('lodash');

const isIndividual = entity => {
  return get(entity, 'entity_type', '').toLowerCase() === 'individual';
};

const lowerCaseEntityName = entity => {
  const name = get(entity, 'entity_nm', '');

  if (name && isIndividual(entity)) {
    entity.entity_nm = name.toLowerCase();
  }
  return entity;
};

module.exports = (config = {}) => {
  const { pool, version } = config;
  return new HAPIRestAPI({
    table: 'crm.entity',
    primaryKey: 'entity_id',
    endpoint: '/crm/' + version + '/entity',
    preInsert: lowerCaseEntityName,
    connection: pool,
    validation: {
      entity_id: Joi.string().guid(),
      entity_nm: Joi.string(),
      entity_type: Joi.string(),
      entity_definition: Joi.string(),
      source: Joi.string()
    }
  });
};
