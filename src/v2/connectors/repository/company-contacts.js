const { CompanyContact } = require('../bookshelf');

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

exports.create = create;
