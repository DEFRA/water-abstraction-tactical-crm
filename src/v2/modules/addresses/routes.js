'use strict';

const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators');
const controller = require('./controller');

exports.postAddress = {
  method: 'POST',
  path: '/crm/2.0/addresses',
  handler: controller.postAddress,
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
        dataSource: validators.ADDRESS_DATA_SOURCE,
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
        addressId: validators.GUID
      }
    }
  }
};

exports.deleteAddress = {
  method: 'DELETE',
  path: '/crm/2.0/addresses/{addressId}',
  handler: (request, h) => entityHandlers.deleteEntity(request, h, 'address'),
  options: {
    description: 'Delete an address entity by id',
    validate: {
      params: {
        addressId: validators.GUID
      }
    }
  }
};
