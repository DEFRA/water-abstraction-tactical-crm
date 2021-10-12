'use strict';

const companiesService = require('../../services/companies');
const companyTypes = require('../../lib/company-types');
const { mapErrorResponse } = require('../../lib/map-error-response');
const { wrapServiceCall } = require('../../lib/wrap-service-call');

const postCompany = async (request, h) => {
  const { type, name, companyNumber = null, organisationType = null, isTest = false } = request.payload;

  try {
    const createdEntity = type === companyTypes.PERSON
      ? await companiesService.createPerson(name, isTest)
      : await companiesService.createOrganisation(name, companyNumber, organisationType, isTest);

    return h.response(createdEntity)
      .created(`/crm/2.0/companies/${createdEntity.companyId}`);
  } catch (err) {
    return mapErrorResponse(err);
  }
};

const getCompany = async request => {
  const { companyId } = request.params;
  const company = await companiesService.getCompany(companyId);
  return company;
};

const searchCompaniesByName = async request => {
  const { name, soft } = request.query;
  const companies = await companiesService.searchCompaniesByName(name, soft);
  return companies;
};

const postCompanyAddress = async (request, h) => {
  const { companyId } = request.params;
  const { addressId, isTest, roleName, ...data } = request.payload;
  try {
    const createdEntity = await companiesService.addAddress(companyId, addressId, roleName, data, isTest);
    return h.response(createdEntity)
      .created(`/crm/2.0/companies/${companyId}/addresses/${createdEntity.companyAddressId}`);
  } catch (err) {
    return mapErrorResponse(err);
  }
};

const postCompanyContact = async (request, h) => {
  const { contactId, isTest, roleName, ...data } = request.payload;
  const { companyId } = request.params;
  try {
    const createdEntity = await companiesService.addContact(companyId, contactId, roleName, data, isTest);
    return h.response(createdEntity)
      .created(`/crm/2.0/companies/${companyId}/contacts/${createdEntity.companyContactId}`);
  } catch (err) {
    return mapErrorResponse(err);
  };
};

const getCompanyAddresses = wrapServiceCall(companiesService, 'getAddresses', request => [request.params.companyId]);

const getCompanyContacts = wrapServiceCall(companiesService, 'getContacts', request => [request.params.companyId]);

const getCompanyInvoiceAccounts = async (request) => {
  const { companyId } = request.params;
  const invoiceAccounts = await companiesService.getCompanyInvoiceAccounts(companyId);
  return invoiceAccounts;
};

const getCompanyLicences = request =>
  companiesService.getCompanyLicences(request.params.companyId);

exports.getCompany = getCompany;
exports.searchCompaniesByName = searchCompaniesByName;
exports.postCompany = postCompany;
exports.postCompanyAddress = postCompanyAddress;
exports.postCompanyContact = postCompanyContact;
exports.getCompanyAddresses = getCompanyAddresses;
exports.getCompanyContacts = getCompanyContacts;
exports.getCompanyInvoiceAccounts = getCompanyInvoiceAccounts;
exports.getCompanyLicences = getCompanyLicences;
