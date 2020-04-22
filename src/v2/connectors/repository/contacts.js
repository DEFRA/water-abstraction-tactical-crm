'use strict';

const Contact = require('../bookshelf/Contact');
const helpers = require('./helpers');

/**
 * Find single Contact by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => helpers.findOne(Contact, 'contactId', id);

/**
 * Create a new contact in crm_v2.contacts
 *
 * @param {Object} contact An object to persist to crm_v2.contacts
 * @returns {Object} The created contact from the database
 */
const create = async contact => helpers.create(Contact, contact);

/**
 * Gets many contacts by id
 *
 * @param {Array<string>} ids The array of UUID values of contacts to find
 */
const findManyByIds = async ids => {
  return Contact.forge().where('contact_id', 'in', ids).fetchAll();
};

exports.create = create;
exports.findManyByIds = findManyByIds;
exports.findOne = findOne;