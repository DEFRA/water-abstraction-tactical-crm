'use strict';

const Joi = require('@hapi/joi');

const companyTypes = require('../../lib/company-types');
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
        roleId: validators.GUID,
        isDefault: validators.DEFAULT_FLAG,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.getCompany = {
  method: 'POST',
  path: '/crm/v2/companies/{companyId}/contacts',
  handler: controller.postCompanyContact,
  options: {
    description: 'Add a contact to a company entity',
    validate: {
      // payload: {
      //   contactId: Joi.string().uuid().required(),
      //   roleId: Joi.string().uuid().required(),
      //   isDefault: Joi.boolean().optional().default(false),
      //   startDate: Joi.date().required(),
      //   endDate: Joi.date().optional().default(null),
      //   isTest: Joi.boolean().optional().default(false)
      // },
      params: {
        companyId: Joi.string().uuid().required()
      }
    }
  }
};

exports.getCompany = {
  method: 'POST',
  path: '/crm/v2/companies/{companyId}/contacts',
  handler: controller.postCompanyContact,
  options: {
    description: 'Add a contact to a company entity',
    validate: {
      // payload: {
      //   contactId: Joi.string().uuid().required(),
      //   roleId: Joi.string().uuid().required(),
      //   isDefault: Joi.boolean().optional().default(false),
      //   startDate: Joi.date().required(),
      //   endDate: Joi.date().optional().default(null),
      //   isTest: Joi.boolean().optional().default(false)
      // },
      params: {
        companyId: Joi.string().uuid().required()
      }
    }
  }
};
