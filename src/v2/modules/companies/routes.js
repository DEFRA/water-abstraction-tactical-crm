'use strict';

const Joi = require('@hapi/joi');

const companyTypes = require('../../lib/company-types');
const organisationTypes = require('../../lib/organisation-types');
const controller = require('./controller');
const entityHandlers = require('../../lib/entity-handlers');
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
        organisationType: Joi.string().valid(Object.values(organisationTypes)).optional(),
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.getCompanyByName = {
  method: 'GET',
  path: '/crm/2.0/companies/search',
  handler: controller.searchCompaniesByName,
  options: {
    description: 'Soft-search companies by name',
    validate: {
      query: {
        name: Joi.string().required().min(2),
        soft: Joi.boolean().optional().default(true)
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

exports.deleteCompany = {
  method: 'DELETE',
  path: '/crm/2.0/companies/{companyId}',
  handler: (request, h) => entityHandlers.deleteEntity(request, h, 'company'),
  options: {
    description: 'Delete a company entity by id',
    validate: {
      params: {
        companyId: validators.GUID
      }
    }
  }
};

exports.deleteCompanyAddress = {
  method: 'DELETE',
  path: '/crm/2.0/companies/{companyId}/addresses/{companyAddressId}',
  handler: (request, h) => entityHandlers.deleteEntity(request, h, 'companyAddress'),
  options: {
    description: 'Delete a company address entity by id',
    validate: {
      params: {
        companyId: validators.GUID,
        companyAddressId: validators.GUID
      }
    }
  }
};

exports.deleteCompanyContact = {
  method: 'DELETE',
  path: '/crm/2.0/companies/{companyId}/contacts/{companyContactId}',
  handler: (request, h) => entityHandlers.deleteEntity(request, h, 'companyContact'),
  options: {
    description: 'Delete a company contact entity by id',
    validate: {
      params: {
        companyId: validators.GUID,
        companyContactId: validators.GUID
      }
    }
  }
};

exports.getCompanyInvoiceAccounts = {
  method: 'GET',
  path: '/crm/2.0/companies/{companyId}/invoice-accounts',
  handler: controller.getCompanyInvoiceAccounts,
  options: {
    description: 'Returns the contacts that belong to a company',
    validate: {
      params: {
        companyId: validators.GUID
      }
    }
  }
};

exports.getCompanyLicences = {
  method: 'GET',
  path: '/crm/2.0/companies/{companyId}/licences',
  handler: controller.getCompanyLicences,
  options: {
    description: 'Returns the licences that belong to a company',
    validate: {
      params: {
        companyId: validators.GUID
      }
    }
  }
};
