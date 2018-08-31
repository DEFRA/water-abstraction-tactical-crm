const HAPIRestAPI = require('hapi-pg-rest-api');
const { version } = require('../../config');
const { pool } = require('../lib/connectors/db');

const kpiReportsApi = new HAPIRestAPI({
  table: 'crm.kpi_view',
  endpoint: '/crm/' + version + '/kpi',
  connection: pool,
  validation: {}
});

module.exports = kpiReportsApi;
