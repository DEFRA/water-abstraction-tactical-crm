'use strict';

const companyTypes = require('../lib/company-types');
const repos = require('../connectors/repository');
const handleRepoError = require('./lib/error-handler');
const errors = require('../lib/errors');

const getRoleId = async roleName => {
  const role = await repos.roles.findOneByName(roleName);
  if (role) return role.roleId;
  throw new errors.EntityValidationError(`Role with name: ${roleName} not found`);
};

const createPerson = async (name, isTest = false) => {
  const person = { name, type: companyTypes.PERSON, isTest };
  const result = await repos.companies.create(person);
  return result;
};

const createOrganisation = async (name, companyNumber = null, organisationType = null, isTest = false) => {
  const company = { name, companyNumber, type: companyTypes.ORGANISATION, organisationType, isTest };
  const result = await repos.companies.create(company);
  return result;
};

const getCompany = async companyId => {
  const result = await repos.companies.findOne(companyId);
  return result;
};

/**
 * Search for companies by name.
 * @param {*} name
 * @param {*} soft  Whether soft search applies. Defaults to true. If set to false, only exact matches will be returned.
 */

const searchCompaniesByName = async (name, soft = true) => {
  try {
    const results = await repos.companies.findAllByName(name, soft);
    return results;
  } catch (err) {
    handleRepoError(err);
  };
};

/**
 * Adds an address to a company
 * @param {String} companyId
 * @param {String} addressId
 * @param {Object} data
 * @param {String} data.roleId
 * @param {Boolean} data.isDefault
 * @param {String} data.startDate
 * @param {String|Null} data.endDate
 * @param {Boolean} isTest
 * @return {Promise<Object>} new record in company_addresses
*/
const addAddress = async (companyId, addressId, roleName, data = {}, isTest = false) => {
  try {
    const companyAddress = {
      companyId,
      addressId,
      roleId: await getRoleId(roleName),
      ...data,
      isTest
    };
    const result = await repos.companyAddresses.create(companyAddress);
    return result;
  } catch (err) {
    handleRepoError(err);
  }
};

/**
 * Adds a contact to a company
 * @param {String} companyId
 * @param {String} contactId
 * @param {Object} data
 * @param {String} data.roleId
 * @param {Boolean} data.isDefault
 * @param {String} data.startDate
 * @param {String|Null} data.endDate
 * @param {Boolean} isTest
 * @return {Promise<Object>} new record in company_contacts
*/
const addContact = async (companyId, contactId, roleName, data = {}, isTest = false) => {
  try {
    const companyContact = {
      companyId,
      contactId,
      ...data,
      roleId: await getRoleId(roleName),
      isTest
    };
    const result = await repos.companyContacts.create(companyContact);
    return result;
  } catch (err) {
    handleRepoError(err);
  }
};

/**
 * Checks that the supplied company ID exists.
 * If not it rejects with a NotFoundError
 * @param {String} companyId
 * @return {Promise}
 */
const assertCompanyExists = async companyId => {
  const company = await getCompany(companyId);
  if (!company) {
    throw new errors.NotFoundError(`Company not found ${companyId}`);
  }
};

/**
 * Gets the CompanyAddress models and related Addresses for the
 * specified company ID
 * @param {String} companyId
 * @return {Promise<Array>}
 */
const getAddresses = async companyId => {
  await assertCompanyExists(companyId);
  return repos.companyAddresses.findManyByCompanyId(companyId);
};

/**
 * Gets the CompanyAddress models and related Addresses for the
 * specified company ID
 * @param {String} companyId
 * @return {Promise<Array>}
 */
const getContacts = async companyId => {
  await assertCompanyExists(companyId);
  return repos.companyContacts.findManyByCompanyId(companyId);
};

const deleteCompany = companyId => repos.companies.deleteOne(companyId);

const deleteCompanyAddress = companyAddressId => repos.companyAddresses.deleteOne(companyAddressId);

const deleteCompanyContact = companyContactId => repos.companyContacts.deleteOne(companyContactId);

exports.getRoleId = getRoleId;
exports.createPerson = createPerson;
exports.createOrganisation = createOrganisation;
exports.getCompany = getCompany;
exports.searchCompaniesByName = searchCompaniesByName;
exports.addAddress = addAddress;
exports.addContact = addContact;
exports.getAddresses = getAddresses;
exports.getContacts = getContacts;
exports.deleteCompany = deleteCompany;
exports.deleteCompanyAddress = deleteCompanyAddress;
exports.deleteCompanyContact = deleteCompanyContact;
