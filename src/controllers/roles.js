const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    table : 'crm.roles',
    primaryKey : 'role_id',
    endpoint : '/crm/' + version + '/roles',
    connection : pool,
    validation : {
      role_id : Joi.string(),
      role_nm : Joi.string()
    }
  });
}
