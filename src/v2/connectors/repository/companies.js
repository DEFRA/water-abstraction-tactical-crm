'use strict';

const { Company } = require('../bookshelf');

/**
 * Create a new person or company and saves in crm_v2.companies
 *
 * @param {Object} personOrCompany An object to persist to crm_v2.companies
 * @returns {Object} The created company from the database
 */
const create = async personOrCompany => {
  const model = await Company.forge(personOrCompany).save();
  return model.toJSON();
};

/**
 * Find single Company by ID
 *
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => {
  const result = await Company.forge({ companyId: id }).fetch();
  return result ? result.toJSON() : null;
};

exports.create = create;
exports.findOne = findOne;
