'use strict';
const Boom = require('@hapi/boom');

const repositories = require('../../connectors/repository');
const mappers = require('../../mappers');

const getInvoiceAccount = async request => {
  const { invoiceAccountId } = request.params;
  const result = await repositories.invoiceAccounts.findOne(invoiceAccountId);
  return result || Boom.notFound(`No invoice account for ${invoiceAccountId}`);
};

const getInvoiceAccounts = async request => {
  const { id: ids } = request.query;
  const results = await repositories.invoiceAccounts.findWithCurrentAddress(ids);
  return results.map(mappers.invoiceAccount.currentAddressOnly);
};

exports.getInvoiceAccounts = getInvoiceAccounts;
exports.getInvoiceAccount = getInvoiceAccount;
