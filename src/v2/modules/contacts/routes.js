'use strict';

const Joi = require('@hapi/joi');
const controller = require('./controller');
const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators');

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
        ids: Joi.array().items(Joi.string().uuid()).required().single()
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
        type: validators.CONTACT_TYPE,
        salutation: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        firstName: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        lastName: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        middleInitials: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        department: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        suffix: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        isTest: validators.TEST_FLAG,
        dataSource: validators.DATA_SOURCE
      }
    }
  }
};

exports.deleteContact = {
  method: 'DELETE',
  path: '/crm/2.0/contacts/{contactId}',
  handler: (request, h) => entityHandlers.deleteEntity(request, h, 'contact'),
  options: {
    description: 'Delete a contact entity by id',
    validate: {
      params: {
        contactId: validators.GUID
      }
    }
  }
};
