'use strict';

const { pickBy, mapKeys } = require('lodash');

const camelCaseKeys = require('../../../lib/camel-case-keys');
const repositories = require('../../connectors/repository');

const getEntityFromRow = (row, prefix) => {
  const data = pickBy(row, (value, key) => key.startsWith(prefix));
  const entity = mapKeys(data, (value, key) => key.replace(prefix, ''));
  return camelCaseKeys(entity);
};

const getInvoiceAccounts = async request => {
  const { id: ids } = request.query;
  const rows = await repositories.invoiceAccounts.findManyByIds(ids);

  return rows.map(row => {
    const invoiceAccount = getEntityFromRow(row, 'invoice_account.');
    invoiceAccount.company = getEntityFromRow(row, 'company.');
    return invoiceAccount;
  });
};

exports.getInvoiceAccounts = getInvoiceAccounts;
