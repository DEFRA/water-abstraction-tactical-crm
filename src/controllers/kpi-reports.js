const HAPIRestAPI = require('hapi-pg-rest-api');

module.exports = (config = {}) => {
  const {pool, version} = config;
  return new HAPIRestAPI({
    table: 'crm.kpi_view',
    endpoint: '/crm/' + version + '/kpi',
    connection: pool,
    validation: {}
  });
};
