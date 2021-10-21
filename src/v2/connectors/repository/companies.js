'use strict';

const { Company, CompanyContact } = require('../bookshelf');
const helpers = require('./helpers');
const queries = require('./queries/companies');
const raw = require('./lib/raw');
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

/**
 * Find companies by name
 * @param {String} name
 * @param {Boolean} soft
 */
const findAllByName = async (name, soft) => raw.multiRow(queries.findByCompanyNameWithSoftSearch, { name: name, soft: soft });

const deleteOne = async id => helpers.deleteOne(Company, 'companyId', id);

const deleteTestData = async () => helpers.deleteTestData(Company);

/**
 * Find a single company by company number
 *
 * @param {String} companyNumber number name
 * @return {Promise<Object>}
 */
const findOneByCompanyNumber = async companyNumber => helpers.findOne(Company, 'companyNumber', companyNumber);

const findLicencesByCompanyId = async companyId =>
  raw.multiRow(queries.findLicencesByCompanyId, { companyId });

exports.create = create;
exports.deleteTestData = deleteTestData;
exports.findOne = findOne;
exports.deleteOne = deleteOne;
exports.findAllByName = findAllByName;
exports.findOneByCompanyNumber = findOneByCompanyNumber;
exports.findLicencesByCompanyId = findLicencesByCompanyId;
