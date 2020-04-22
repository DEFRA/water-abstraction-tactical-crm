'use strict';

const Joi = require('@hapi/joi');
const controller = require('./controller');
const entityHandlers = require('../../lib/entity-handlers');

exports.getContact = {
  method: 'GET',
  path: '/crm/2.0/contacts/{contactId}',
  handler: request => entityHandlers.getEntity(request, 'contact'),
  options: {
    description: 'Get a contact by id',
    validate: {
      params: {
        contactId: Joi.string().guid().required()
      }
    }
  }
};

exports.getContacts = {
  method: 'GET',
  path: '/crm/2.0/contacts',
  handler: controller.getContacts,
  options: {
    description: 'Get a list of contacts by id',
    validate: {
      query: {
        ids: Joi.string().required()
      }
    }
  }
};

exports.postContact = {
  method: 'POST',
  path: '/crm/2.0/contacts',
  handler: (request, h) => entityHandlers.createEntity(request, h, 'contact'),
  options: {
    description: 'Creates a new contact',
    validate: {
      payload: {
        salutation: Joi.string().optional(),
        firstName: Joi.string().optional(),
        initials: Joi.string().optional(),
        lastName: Joi.string().required(),
        middleName: Joi.string().optional(),
        isTest: Joi.boolean().optional().default(false)
      }
    }
  }
};
