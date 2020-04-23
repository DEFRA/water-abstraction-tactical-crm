'use strict';

const contactValidator = require('../modules/contacts/validator');
const contactsRepo = require('../connectors/repository/contacts');
const errors = require('../lib/errors');

const createContact = async contact => {
  const { error, value: validatedContact } = contactValidator.validate(contact);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new errors.EntityValidationError('Contact not valid', details);
  }

  return contactsRepo.create(validatedContact);
};

const getContact = contactId => contactsRepo.findOne(contactId);

const getContactsByIds = ids => contactsRepo.findManyByIds(ids);

exports.createContact = createContact;
exports.getContact = getContact;
exports.getContactsByIds = getContactsByIds;
