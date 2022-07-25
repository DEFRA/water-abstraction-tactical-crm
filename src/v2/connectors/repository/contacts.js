'use strict'

const Contact = require('../bookshelf/Contact')
const helpers = require('./helpers')

/**
 * Find single Contact by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => helpers.findOne(Contact, 'contactId', id)

/**
 * Create a new contact in crm_v2.contacts
 *
 * @param {Object} contact An object to persist to crm_v2.contacts
 * @returns {Object} The created contact from the database
 */
const create = async contact => helpers.create(Contact, contact)

/**
 * Gets many contacts by id
 *
 * @param {Array<string>} ids The array of UUID values of contacts to find
 */
const findManyByIds = async ids => {
  return Contact.forge().where('contact_id', 'in', ids).fetchAll()
}

const deleteOne = async id => helpers.deleteOne(Contact, 'contactId', id)

const deleteTestData = async () => helpers.deleteTestData(Contact)

/**
 * Find single Contact by ID with related companies
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOneWithCompanies = async id =>
  helpers.findOne(Contact, 'contactId', id, [
    'companyContacts'
  ])

const update = async (id, payload) => helpers.update(Contact, 'contactId', id, payload)

exports.create = create
exports.deleteOne = deleteOne
exports.deleteTestData = deleteTestData
exports.findManyByIds = findManyByIds
exports.findOne = findOne
exports.findOneWithCompanies = findOneWithCompanies
exports.update = update
