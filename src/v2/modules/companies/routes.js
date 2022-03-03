'use strict';

const Joi = require('joi');
const companyTypes = require('../../lib/company-types');
const controller = require('./controller');
const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators-v2');
const { companyTypesArr } = require('../../lib/company-types');
const { organisationTypesArr } = require('../../lib/organisation-types');

exports.createCompany = {
  method: 'POST',
  path: '/crm/2.0/companies',
  handler: controller.postCompany,
  options: {
    description: 'Creates a company entity',
    validate: {
      payload: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().valid(...companyTypesArr).required(),
        companyNumber: Joi.forbidden().when('type', {
          is: companyTypes.ORGANISATION,
          then: Joi.string().allow('').optional()
        }),
        organisationType: Joi.string().valid(...organisationTypesArr).optional(),
        isTest: validators.TEST_FLAG
      })
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
      query: Joi.object().keys({
        name: Joi.string().required().min(2),
        soft: Joi.boolean().optional().default(true)
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID
      }),
      payload: Joi.object().keys({
        addressId: validators.GUID,
        roleName: validators.ROLE_NAMES,
        isDefault: validators.DEFAULT_FLAG,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID
      }),
      payload: Joi.object().keys({
        contactId: validators.GUID,
        roleName: validators.ROLE_NAMES,
        isDefault: validators.DEFAULT_FLAG,
        emailAddress: validators.EMAIL,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID,
        companyAddressId: validators.GUID
      })
    }
  }
};

exports.patchCompanyContact = {
  method: 'PATCH',
  path: '/crm/2.0/companies/{companyId}/contacts/{contactId}',
  handler: controller.patchCompanyContact,
  options: {
    description: 'Patches a company contact entity',
    validate: {
      params: Joi.object().keys({
        companyId: validators.GUID,
        contactId: validators.GUID
      }),
      payload: Joi.object().keys({
        waterAbstractionAlertsEnabled: validators.DEFAULT_FLAG
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID,
        companyContactId: validators.GUID
      })
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
      params: Joi.object().keys({
        companyId: validators.GUID
      })
    }
  }
};

exports.getCompanyLicences = {
  method: 'GET',
  path: '/crm/2.0/companies/{companyId}/licences',
  handler: controller.getCompanyLicences,
  options: {
    description: 'Returns the licences that currently belong to a company',
    validate: {
      params: Joi.object().keys({
        companyId: validators.GUID
      })
    }
  }
};

exports.getCompanyWAAEmailContacts = {
  method: 'GET',
  path: '/crm/2.0/companies/{companyId}/contacts/water-abstraction-alert-email-recipients',
  handler: controller.getCompanyWAAEmailContacts,
  options: {
    description: 'Returns the contacts under the company which have an email and are opted into Water Abstraction alerts',
    validate: {
      params: Joi.object().keys({
        companyId: validators.GUID
      })
    }
  }
};
