'use strict';

const companiesService = require('../../services/companies');
const companyTypes = require('../../lib/company-types');

const postCompany = async (request, h) => {
  const { type, name, companyNumber = null, isTest = false } = request.payload;

  const createdEntity = type === companyTypes.PERSON
    ? await companiesService.createPerson(name, isTest)
    : await companiesService.createOrganisation(name, companyNumber, isTest);

  return h.response(createdEntity)
    .created(`/crm/2.0/companies/${createdEntity.companyId}`);
};

const getCompany = async request => {
  const { companyId } = request.params;
  const company = await companiesService.getCompany(companyId);
  return company;
};

const postCompanyContact = async (request, h) => {
  const { contactId, roleId, isDefault, startDate, endDate, isTest } = request.payload;
  const { companyId } = request.params;
  const companyContact = {
    companyId,
    contactId,
    roleId,
    isDefault,
    startDate,
    endDate,
    isTest
  };
  try {
    const createdEntity = await companiesService.createCompanyContact(companyContact);
    return h.response(createdEntity).created(`/crm/2.0/companies/${createdEntity.companyId}`);
  } catch (err) {
    return err;
  };
};

exports.getCompany = getCompany;
exports.postCompany = postCompany;
exports.postCompanyContact = postCompanyContact;
