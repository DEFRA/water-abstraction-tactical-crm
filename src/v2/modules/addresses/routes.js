'use strict';

const Joi = require('@hapi/joi');
const controller = require('./controller');

exports.createAddress = {
  method: 'POST',
  path: '/crm/2.0/addresses',
  handler: controller.postAddress,
  options: {
    description: 'Creates a new address',
    validate: {
      payload: {
        address1: Joi.string().required(),
        address2: Joi.string().optional(),
        address3: Joi.string().optional(),
        address4: Joi.string().optional(),
        town: Joi.string().required(),
        county: Joi.string().required(),
        country: Joi.string().required(),
        postcode: Joi.string().optional(),
        isTest: Joi.boolean().optional().default(false)
      }
    }
  }
};

exports.getAddress = {
  method: 'GET',
  path: '/crm/2.0/addresses/{addressId}',
  handler: controller.getAddress,
  options: {
    description: 'Get an address entity',
    validate: {
      params: {
        addressId: Joi.string().uuid().required()
      }
    }
  }
};
