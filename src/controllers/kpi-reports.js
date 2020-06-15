const HAPIRestAPI = require('@envage/hapi-pg-rest-api');
const { version } = require('../../config');
const { pool } = require('../lib/connectors/db');
const { getEntityRolesKPIdata } = require('../lib/CRM');

const kpiReportsApi = new HAPIRestAPI({
  table: 'crm.kpi_view',
  endpoint: '/crm/' + version + '/kpi',
  connection: pool,
  validation: {}
});

const mapKPIAccessRequestData = (sortedList) => {
  return sortedList.reduce((acc, row, index) => {
    if (row.current_year) {
      acc.push({
        month: row.month,
        total: row.total,
        change: (row.total - sortedList[(index - 1)].total) / sortedList[(index - 1)].total * 100
      });
    }
    return acc;
  }, []);
};

const getKPIEntityRolesData = async (request, h) => {

  // get the data from the repo
  const data = await getEntityRolesKPIdata(request, h);
  // sort the data in ascending order
  const sorted = data.sort((a, b) => a.year + '' + a.month - b.year + '' + b.month);
  // map the monthly data and calculate the percentage change by  month
  const monthly = mapKPIAccessRequestData(sorted);

  // calculate the overall totals
  const totals = data.reduce((acc, row) => {
    acc.allTime = acc.allTime + row.total;
    acc.ytd = row.current_year ? acc.ytd + row.total : acc.ytd;
    return acc;
  }, { allTime: 0, ytd: 0 });

  return { data: { totals, monthly }, error: null };
};

module.exports = kpiReportsApi;
module.exports.getKPIEntityRolesData = getKPIEntityRolesData;
