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

exports.findOne = findOne;
exports.create = create;