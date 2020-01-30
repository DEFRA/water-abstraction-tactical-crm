'use strict';

const Boom = require('@hapi/boom');
const { pickBy, mapKeys } = require('lodash');

const camelCaseKeys = require('../../../lib/camel-case-keys');
const repositories = require('../../connectors/repository');

const getEntityFromRow = (row, prefix) => {
  const data = pickBy(row, (value, key) => key.startsWith(prefix));
  const entity = mapKeys(data, (value, key) => key.replace(prefix, ''));
  return camelCaseKeys(entity);
};

const createInvoiceAccountFromRow = row => {
  const invoiceAccount = getEntityFromRow(row, 'invoice_account.');
  invoiceAccount.company = getEntityFromRow(row, 'company.');
  return invoiceAccount;
};

const getInvoiceAccounts = async request => {
  const { id: ids } = request.query;
  const rows = await repositories.invoiceAccounts.findManyByIds(ids);

  return rows.map(createInvoiceAccountFromRow);
};

const getInvoiceAccount = async request => {
  const { invoiceAccountId } = request.params;
  const result = await repositories.invoiceAccounts.findOneById(invoiceAccountId);

  return result
    ? createInvoiceAccountFromRow(result)
    : Boom.notFound(`No invoice account for ${invoiceAccountId}`);
};

exports.getInvoiceAccounts = getInvoiceAccounts;
exports.getInvoiceAccount = getInvoiceAccount;
