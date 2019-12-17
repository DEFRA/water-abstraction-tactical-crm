const Joi = require('@hapi/joi');
const controller = require('./controller');

exports.getContact = {
  method: 'GET',
  path: '/crm/2.0/contacts/{contactId}',
  handler: controller.getContact,
  options: {
    description: 'Get a contact by id',
    validate: {
      params: {
        contactId: Joi.string().guid().required()
      }
    }
  }
};

exports.getDocuments = {
  method: 'GET',
  path: '/crm/2.0/contacts',
  handler: controller.getContacts,
  options: {
    description: 'Get a list of contacts by id',
    validate: {
      query: {
        id: Joi.array().single().items(Joi.string().guid())
      }
    }
  }
};
