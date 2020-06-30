'use strict';

const { CompanyAddress } = require('../bookshelf');
const helpers = require('./helpers');

/**
 * Create a new company address and saves in crm_v2.company_addresses
 *
 * @param {Object} companyAddress An object to persist to crm_v2.company_addresses
 * @returns {Promise<Object>} The created company address from the database, camel-cased
 */
const create = async companyAddress => {
  const model = await CompanyAddress.forge(companyAddress).save();
  return model.toJSON();
};

const deleteTestData = async () => helpers.deleteTestData(CompanyAddress);

/**
 * Finds many company addresses, including related company, by company ID
 * @param {String} companyId
 * @return {Promise<Array>}
 */
const findManyByCompanyId = async companyId => {
  const collection = await CompanyAddress
    .collection()
    .where('company_id', companyId)
    .fetch({
      withRelated: [
        'address'
      ]
    });
  return collection.toJSON();
};

exports.create = create;
exports.deleteTestData = deleteTestData;
exports.findManyByCompanyId = findManyByCompanyId;
