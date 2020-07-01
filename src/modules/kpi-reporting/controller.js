'user-strict';
const repo = require('../../lib/repo/kpi-reporting');
const Boom = require('@hapi/boom');

const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const percentageChage = (index, data, row) => {
  if (index < (data.length - 1)) {
    return (row.total - data[(index + 1)].total) / (data[(index + 1)].total < 1 ? 1 : data[(index + 1)].total) * 100;
  } else {
    return 0;
  }
};

const mapKPIAccessRequestData = (data) => {
  return data.reduce((acc, row, index) => {
    if (row.current_year) {
      acc.push({
        month: months[row.month - 1],
        year: row.year,
        total: row.total,
        change: percentageChage(index, data, row)
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

  // map the monthly data and calculate the percentage change by  month
  const monthly = mapKPIAccessRequestData(data);

  // calculate the overall totals
  const totals = data.reduce((acc, row) => {
    acc.allTime = acc.allTime + row.total;
    acc.ytd = row.current_year ? acc.ytd + row.total : acc.ytd;
    return acc;
  }, { allTime: 0, ytd: 0 });

  return { data: { totals, monthly } };
};

module.exports.getKPIEntityRolesData = getKPIEntityRolesData;
