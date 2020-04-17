'use strict';

const { CompanyAddress } = require('../bookshelf');

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

exports.create = create;
