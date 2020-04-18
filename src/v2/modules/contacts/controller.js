'use strict';

const Boom = require('@hapi/boom');

const { logger } = require('../../../logger');
const mapErrorResponse = require('../../lib/map-error-response');
const contactService = require('../../services/contacts');

const getContact = async request => {
  const { contactId } = request.params;
  const contact = await contactService.getContact(contactId);

  return contact || Boom.notFound(`No contact for ${contactId}`);
};

const getContacts = async request => {
  try {
    return contactService.getContactsByIds(request.query.ids.split(','));
  } catch (err) {
    logger.error('Could not get contacts', err);
    return Boom.boomify(err);
  }
};

const postContact = async (request, h) => {
  const contactData = request.payload;

  try {
    const contact = await contactService.createContact(contactData);
    return h.response(contact).created(`/crm/2.0/contacts/${contact.contactId}`);
  } catch (error) {
    return mapErrorResponse(error);
  }
};

exports.getContact = getContact;
exports.getContacts = getContacts;
exports.postContact = postContact;
