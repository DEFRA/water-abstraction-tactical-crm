'use strict';

const InvoiceAccountAddress = require('../bookshelf/InvoiceAccountAddress');
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

const deleteOne = async id => helpers.deleteOne(InvoiceAccountAddress, 'invoiceAccountAddressId', id);

const deleteTestData = async () => helpers.deleteTestData(InvoiceAccountAddress);

exports.create = create;
exports.deleteOne = deleteOne;
exports.deleteTestData = deleteTestData;
exports.findAll = findAll;
