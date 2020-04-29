'use strict';

const CompanyContact = require('../bookshelf/CompanyContact');
const helpers = require('./helpers');

/**
 * Insert a new company contact record
 * @param {Object} data - camel case
 */
const create = async companyContact => {
  const model = await CompanyContact
    .forge(companyContact)
    .save();
  return model.toJSON();
};

const deleteTestData = async () => helpers.deleteTestData(CompanyContact);

exports.create = create;
exports.deleteTestData = deleteTestData;
