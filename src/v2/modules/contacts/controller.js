'use strict';

const Boom = require('@hapi/boom');

const { logger } = require('../../../logger');
const contactService = require('../../services/contacts');

const getContacts = async request => {
  try {
    return contactService.getContactsByIds(request.query.ids);
  } catch (err) {
    logger.error('Could not get contacts', err);
    return Boom.boomify(err);
  }
};

exports.getContacts = getContacts;
