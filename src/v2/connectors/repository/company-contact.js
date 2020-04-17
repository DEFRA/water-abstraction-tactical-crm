const { CompanyContact } = require('../bookshelf');

/**
 * Find single InvoiceAccount with relations by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => {
  const result = await CompanyContact
    .forge({ companyContactId: id })
    .fetch();
  return result ? result.toJSON() : null;
};

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

exports.findOne = findOne;
exports.create = create;
