'use strict';

const { Company } = require('../bookshelf');
const helpers = require('./helpers');
/**
 * Create a new person or company and saves in crm_v2.companies
 *
 * @param {Object} personOrCompany An object to persist to crm_v2.companies
 * @returns {Object} The created company from the database
 */
const create = async personOrCompany => helpers.create(Company, personOrCompany);

/**
 * Find single Company by ID
 *
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => helpers.findOne(Company, 'companyId', id);

const deleteOne = async id => helpers.deleteOne(Company, 'companyId', id);

const deleteTestData = async () => helpers.deleteTestData(Company);

exports.create = create;
exports.deleteTestData = deleteTestData;
exports.findOne = findOne;
exports.deleteOne = deleteOne;
