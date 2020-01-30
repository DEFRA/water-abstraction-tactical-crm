const Boom = require('@hapi/boom');
const camelCaseKeys = require('../../../lib/camel-case-keys');
const repositories = require('../../connectors/repository');

const getContact = async request => {
  const { contactId } = request.params;
  const contact = await repositories.contacts.findOneById(request.params.contactId);
  return contact ? camelCaseKeys(contact) : Boom.notFound(`No contact for ${contactId}`);
};

const getContacts = async request => {
  const { ids } = request.query;
  const rows = await repositories.contacts.findManyById(ids.split(','));
  return rows.map(camelCaseKeys);
};

exports.getContact = getContact;
exports.getContacts = getContacts;
