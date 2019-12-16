const camelCaseKeys = require('../../../lib/camel-case-keys');
const repos = require('../../../v2/connectors/repository');

const getCompanies = async request => {
  const { invoiceAccountIds } = request.query;
  const rows = await repos.companies.findByInvoiceAccountIds(invoiceAccountIds.split(','));
  return rows.map(camelCaseKeys);
};

exports.getCompanies = getCompanies;
