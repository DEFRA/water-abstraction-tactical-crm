'use strict';

const companyTypes = require('../lib/company-types');
const repos = require('../connectors/repository');
const errors = require('../lib/errors');

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
    if (parseInt(err.code) === 23505) {
      throw new errors.UniqueConstraintViolation(err.detail);
    }
    throw err;
  }
};

const createCompanyContact = async companyContact => {
  const result = await repos.companyContact.create(companyContact);
  return result;
};

exports.createPerson = createPerson;
exports.createOrganisation = createOrganisation;
exports.getCompany = getCompany;
exports.createCompanyContact = createCompanyContact;
exports.addAddress = addAddress;
