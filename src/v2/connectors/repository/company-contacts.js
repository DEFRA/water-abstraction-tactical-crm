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

const deleteOne = async id => helpers.deleteOne(CompanyContact, 'companyContactId', id);

const deleteTestData = async () => helpers.deleteTestData(CompanyContact);

/**
 * Finds many company contacts, including related company, by company ID
 * @param {String} companyId
 * @return {Promise<Array>}
 */
const findManyByCompanyId = async companyId => {
  const collection = await CompanyContact
    .collection()
    .where('company_id', companyId)
    .fetch({
      withRelated: ['contact', 'role']
    });

  return collection.toJSON();
};

/**
 * Finds one for the supplied company_role_contact constraint values
 *
 * @param {String} companyId - guid
 * @param {String} contactId - guid
 * @param {String} roleId - guid
 * @param {String} startDate - YYYY-MM-DD
 * @return {Promise<Object>}
 */
const findOneByCompanyRoleContact = (companyId, contactId, roleId, startDate) =>
  helpers.findOneBy(CompanyContact, {
    companyId,
    contactId,
    roleId,
    startDate
  });

const updateOneByCompanyIdAndContactId = async (companyId, contactId, payload) => {
  const row = await helpers.findOneBy(CompanyContact, { companyId, contactId });
  return helpers.update(CompanyContact, 'companyContactId', row.companyContactId, payload);
};
exports.create = create;
exports.deleteOne = deleteOne;
exports.deleteTestData = deleteTestData;
exports.findManyByCompanyId = findManyByCompanyId;
exports.findOneByCompanyRoleContact = findOneByCompanyRoleContact;
exports.updateOneByCompanyIdAndContactId = updateOneByCompanyIdAndContactId;
