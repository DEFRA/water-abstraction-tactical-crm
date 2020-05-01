'use strict';

const companyTypes = require('../lib/company-types');
const repos = require('../connectors/repository');
const handleRepoError = require('./lib/error-handler');

const createPerson = async (name, isTest = false) => {
  const person = { name, type: companyTypes.PERSON, isTest };
  const result = await repos.companies.create(person);
  return result;
};

const createOrganisation = async (name, companyNumber = null, isTest = false) => {
  const company = { name, companyNumber, type: companyTypes.ORGANISATION, isTest };
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

exports.createPerson = createPerson;
exports.createOrganisation = createOrganisation;
exports.getCompany = getCompany;
exports.addAddress = addAddress;
exports.addContact = addContact;
