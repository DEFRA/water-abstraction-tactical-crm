const camelCaseKeys = require('../../../lib/camel-case-keys');
const repos = require('../../../v2/connectors/repository');

const getCompanies = async request => {
  const { invoiceAccountNumber: invoiceAccountNumbers } = request.query;
  const rows = await repos.companies.findByInvoiceAccountNumbers(invoiceAccountNumbers);
  return rows.map(camelCaseKeys);
};

exports.getCompanies = getCompanies;
