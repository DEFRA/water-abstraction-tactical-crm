'use strict';

const Boom = require('@hapi/boom');

const { logger } = require('../../../logger');
const invoiceAccountService = require('../../services/invoice-accounts');

const getInvoiceAccounts = async request => {
  try {
    return invoiceAccountService.getInvoiceAccountsByIds(request.query.id);
  } catch (err) {
    logger.error('Could not get invoice accounts', err);
    return Boom.boomify(err);
  }
};

const getInvoiceAccountsWithRecentlyUpdatedEntities = () => {
  try {
    return invoiceAccountService.getInvoiceAccountsWithRecentlyUpdatedEntities;
  } catch (err) {
    logger.error('Could not get recently updated invoice accounts', err);
    return Boom.boomify(err);
  }
};

exports.getInvoiceAccounts = getInvoiceAccounts;
exports.getInvoiceAccountsWithRecentlyUpdatedEntities = getInvoiceAccountsWithRecentlyUpdatedEntities;
