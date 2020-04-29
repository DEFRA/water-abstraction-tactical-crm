const { InvoiceAccountAddress } = require('../bookshelf');
const helpers = require('./helpers');

/**
 * Create a new invoice account address in crm_v2.invoice_account_addresses
 *
 * @param {Object} invoiceAccountAddress An object to persist to crm_v2.invoice_account_addresses
 * @returns {Object} The created invoice account address from the database
 */
const create = async invoiceAccountAddress => helpers.create(InvoiceAccountAddress, invoiceAccountAddress);

/**
 * Retrieved invoice account address in crm_v2.invoice_account_addresses
 *
 * @param {Object} invoiceAccountAddress An object to persist to crm_v2.invoice_account_addresses
 * @returns {Object} The created invoice account address from the database
 */
const findAll = async invoiceAccountId => helpers.findAll(InvoiceAccountAddress, 'invoiceAccountId', invoiceAccountId);

exports.create = create;
exports.findAll = findAll;
