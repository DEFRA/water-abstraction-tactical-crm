const { CompanyContact } = require('../bookshelf');

/**
 * Insert a new company contact record
 * @param {Object} data - camel case
 */
const create = async data => {
  const model = await CompanyContact
    .forge(data)
    .save();
  return model.toJSON();
};

exports.create = create;
