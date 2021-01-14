'use strict';

const Address = require('../bookshelf/Address');
const helpers = require('./helpers');

/**
 * Find single Address by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => helpers.findOne(Address, 'addressId', id);

/**
 * Create a new address in crm_v2.addresses
 *
 * @param {Object} address An object to persist to crm_v2.addresses
 * @returns {Object} The created address from the database
 */
const create = async address => helpers.create(Address, address);

const deleteOne = async id => helpers.deleteOne(Address, 'addressId', id);

const deleteTestData = async () => helpers.deleteTestData(Address);

/**
 * Find single address by ID with related companies
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOneWithCompanies = async id =>
  helpers.findOne(Address, 'addressId', id, [
    'companyAddresses'
  ]);

/**
* Find address by uprn
* @param {String} uprn
* @return {Promise<Object>}
*/
const findByUprn = uprn => helpers.findOne(Address, 'uprn', uprn);

exports.findOne = findOne;
exports.create = create;
exports.deleteOne = deleteOne;
exports.deleteTestData = deleteTestData;
exports.findOneWithCompanies = findOneWithCompanies;
exports.findByUprn = findByUprn;
