'use strict';

const companyTypes = require('../lib/company-types');
const repos = require('../connectors/repository');
const handleRepoError = require('./lib/error-handler');
const errors = require('../lib/errors');

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
const addAddress = async (companyId, addressId, data = {}, isTest = false) => {
  const companyAddress = {
    companyId,
    addressId,
    ...data,
    isTest
  };
  try {
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
const addContact = async (companyId, contactId, data = {}, isTest = false) => {
  const companyContact = {
    companyId,
    contactId,
    ...data,
    isTest
  };
  try {
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

exports.createPerson = createPerson;
exports.createOrganisation = createOrganisation;
exports.getCompany = getCompany;
exports.addAddress = addAddress;
exports.addContact = addContact;
exports.getAddresses = getAddresses;
exports.getContacts = getContacts;
