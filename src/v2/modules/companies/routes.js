'use strict';

const Joi = require('@hapi/joi');

const companyTypes = require('../../lib/company-types');
const organisationTypes = require('../../lib/organisation-types');
const controller = require('./controller');
const validators = require('../../lib/validators');

exports.createCompany = {
  method: 'POST',
  path: '/crm/2.0/companies',
  handler: controller.postCompany,
  options: {
    description: 'Creates a company entity',
    validate: {
      payload: {
        name: Joi.string().required(),
        type: Joi.string().valid(Object.values(companyTypes)).required(),
        companyNumber: Joi.forbidden().when('type', {
          is: companyTypes.ORGANISATION,
          then: Joi.string().allow('').optional()
        }),
        organisationType: Joi.forbidden().when('type', {
          is: companyTypes.ORGANISATION,
          then: Joi.string().valid(Object.values(organisationTypes)).optional()
        }),
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.getCompany = {
  method: 'GET',
  path: '/crm/2.0/companies/{companyId}',
  handler: controller.getCompany,
  options: {
    description: 'Get a company entity',
    validate: {
      params: {
        companyId: validators.GUID
      }
    }
  }
};

exports.postCompanyAddress = {
  method: 'POST',
  path: '/crm/2.0/companies/{companyId}/addresses',
  handler: controller.postCompanyAddress,
  options: {
    description: 'Adds an address to a company entity',
    validate: {
      params: {
        companyId: validators.GUID
      },
      payload: {
        addressId: validators.GUID,
        roleName: validators.ROLE_NAMES,
        isDefault: validators.DEFAULT_FLAG,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.postCompanyContact = {
  method: 'POST',
  path: '/crm/2.0/companies/{companyId}/contacts',
  handler: controller.postCompanyContact,
  options: {
    description: 'Add a contact to a company entity',
    validate: {
      params: {
        companyId: validators.GUID
      },
      payload: {
        contactId: validators.GUID,
        roleName: validators.ROLE_NAMES,
        isDefault: validators.DEFAULT_FLAG,
        emailAddress: validators.EMAIL,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.getCompanyAddresses = {
  method: 'GET',
  path: '/crm/2.0/companies/{companyId}/addresses',
  handler: controller.getCompanyAddresses,
  options: {
    description: 'Get the addresses belonging to a company',
    validate: {
      params: {
        companyId: validators.GUID
      }
    }
  }
};

exports.getCompanyContacts = {
  method: 'GET',
  path: '/crm/2.0/companies/{companyId}/contacts',
  handler: controller.getCompanyContacts,
  options: {
    description: 'Get the contacts belonging to a company',
    validate: {
      params: {
        companyId: validators.GUID
      }
    }
  }
};
