const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    table : 'crm.kpi_view',
    endpoint : '/crm/' + version + '/kpi',
    connection : pool,
    validation:{}
  });
}
