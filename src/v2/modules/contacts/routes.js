'use strict';

const Joi = require('joi');
const controller = require('./controller');
const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators-v2');

exports.getContact = {
  method: 'GET',
  path: '/crm/2.0/contacts/{contactId}',
  handler: request => entityHandlers.getEntity(request, 'contact'),
  options: {
    description: 'Get a contact by id',
    validate: {
      params: Joi.object().keys({
        contactId: Joi.string().guid().required()
      })
    }
  }
};

exports.patchContact = {
  method: 'PATCH',
  path: '/crm/2.0/contacts/{contactId}',
  handler: controller.patchContact,
  options: {
    description: 'Patches a contact given its id',
    validate: {
      params: Joi.object().keys({
        contactId: Joi.string().guid().required()
      }),
      payload: Joi.object().keys({
        salutation: Joi.string().optional().allow(''),
        email: Joi.string().email().optional(),
        firstName: Joi.string().optional().allow(''),
        lastName: Joi.string().optional().allow(''),
        department: Joi.string().optional().allow(''),
        middleInitials: Joi.string().optional().allow(''),
        suffix: Joi.string().optional().allow('')
      })
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
      query: Joi.object().keys({
        ids: Joi.array().items(Joi.string().uuid()).required().single()
      })
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
      payload: Joi.object().keys({
        type: validators.CONTACT_TYPE,
        salutation: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        firstName: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        lastName: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        middleInitials: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        department: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        suffix: validators.OPTIONAL_STRING_NO_DEFAULT_VALUE,
        isTest: validators.TEST_FLAG,
        dataSource: validators.DATA_SOURCE
      })
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
      params: Joi.object().keys({
        contactId: validators.GUID
      })
    }
  }
};
