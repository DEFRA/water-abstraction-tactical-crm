'use strict';

const Joi = require('@hapi/joi');
const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators');

exports.postAddress = {
  method: 'POST',
  path: '/crm/2.0/addresses',
  handler: (request, h) => entityHandlers.createEntity(request, h, 'address'),
  options: {
    description: 'Creates a new address',
    validate: {
      payload: {
        address1: validators.OPTIONAL_STRING,
        address2: validators.OPTIONAL_STRING,
        address3: validators.OPTIONAL_STRING,
        address4: validators.OPTIONAL_STRING,
        town: validators.OPTIONAL_STRING,
        county: validators.OPTIONAL_STRING,
        country: validators.REQUIRED_STRING,
        postcode: validators.OPTIONAL_STRING,
        isTest: validators.TEST_FLAG,
        dataSource: validators.DATA_SOURCE,
        uprn: validators.UPRN
      }
    }
  }
};

exports.getAddress = {
  method: 'GET',
  path: '/crm/2.0/addresses/{addressId}',
  handler: request => entityHandlers.getEntity(request, 'address'),
  options: {
    description: 'Get an address entity',
    validate: {
      params: {
        addressId: Joi.string().uuid().required()
      }
    }
  }
};
