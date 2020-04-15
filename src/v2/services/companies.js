'use strict';

const companyTypes = require('../lib/company-types');
const repos = require('../connectors/repository');

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

exports.createPerson = createPerson;
exports.createOrganisation = createOrganisation;
exports.getCompany = getCompany;
