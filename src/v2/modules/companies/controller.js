'use strict';

const companiesService = require('../../services/companies');
const companyTypes = require('../../lib/company-types');
const { mapErrorResponse } = require('../../lib/map-error-response');

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

const postCompanyAddress = async (request, h) => {
  const { companyId } = request.params;
  const { addressId, isTest, ...data } = request.payload;
  try {
    const createdEntity = await companiesService.addAddress(companyId, addressId, data, isTest);
    return h.response(createdEntity)
      .created(`/crm/2.0/companies/${companyId}/addresses/${createdEntity.companyAddressId}`);
  } catch (err) {
    return mapErrorResponse(err);
  }
};

const postCompanyContact = async (request, h) => {
  const { contactId, isTest, ...data } = request.payload;
  const { companyId } = request.params;
  try {
    const createdEntity = await companiesService.addContact(companyId, contactId, data, isTest);
    return h.response(createdEntity)
      .created(`/crm/2.0/companies/${companyId}/contacts/${createdEntity.companyContactId}`);
  } catch (err) {
    return mapErrorResponse(err);
  };
};

const getCompanyAddresses = async (request, h) => {
  try {
    const companyAddresses = await companiesService.getAddresses(request.params.companyId);
    return companyAddresses;
  } catch (err) {
    return mapErrorResponse(err);
  }
};

exports.getCompany = getCompany;
exports.postCompany = postCompany;
exports.postCompanyAddress = postCompanyAddress;
exports.postCompanyContact = postCompanyContact;
exports.getCompanyAddresses = getCompanyAddresses;
