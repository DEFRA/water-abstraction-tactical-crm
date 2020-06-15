'user-strict';
const repo = require('../../lib/repo/kpi-reporting');
const Boom = require('@hapi/boom');

const mapKPIAccessRequestData = (sortedList) => {
  return sortedList.reduce((acc, row, index) => {
    if (row.current_year) {
      acc.push({
        month: row.month,
        total: row.total,
        change: index > 0 ? (row.total - sortedList[(index - 1)].total) / sortedList[(index - 1)].total * 100 : 0
      });
    }
    return acc;
  }, []);
};

const getKPIEntityRolesData = async () => {
  // get the data from the repo
  const { data, error } = await repo.getEntityRolesKPIdata();

  if (error) {
    return Boom.notFound('Entity roles data not found', error);
  }

  // sort the data in ascending order
  const sorted = data.sort((a, b) => (a.year + '' + a.month).localeCompare(b.year + '' + b.month));
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

module.exports.getKPIEntityRolesData = getKPIEntityRolesData;
