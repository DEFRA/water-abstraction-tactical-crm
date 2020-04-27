'use strict';

const urlJoin = require('url-join');
const Boom = require('@hapi/boom');

const { camelCase } = require('lodash');
const { mapErrorResponse } = require('./map-error-response');
const contactsService = require('../services/contacts');
const addressService = require('../services/address');
const invoiceAccountsService = require('../services/invoice-accounts');

const services = {
  contact: contactsService,
  address: addressService,
  invoiceAccount: invoiceAccountsService
};

const validateKey = key => {
  const knownKeys = Object.keys(services);
  if (!knownKeys.includes(key)) {
    throw new Error(`Unknown key (${key}) passed to entity-handlers`);
  }
};

/**
 * Helper function to abstract common entity creation for the controllers
 *
 * @param {Object} request HAPI request object
 * @param {Object} h HAPI response toolkit
 * @param {String} key The entity type being created (e.g. contact)
 */
const createEntity = async (request, h, key) => {
  validateKey(key);

  try {
    const createFn = camelCase(['create', key]);
    const entity = await services[key][createFn](request.payload);
    const location = urlJoin(request.path, entity[`${key}Id`]);
    return h.response(entity).created(location);
  } catch (error) {
    return mapErrorResponse(error);
  }
};

/**
 * Helper function to abstract the basic case of fetching
 * an entity via a route handler.
 *
 * @param {Object} request HAPI request object
 * @param {String} key The entity type being fetched (e.g. address)
 */
const getEntity = async (request, key) => {
  validateKey(key);

  // get the entity id from the request e.g. request.params.contactId
  const id = request.params[`${key}Id`];

  // create the name of the function to call on the service
  // e.g. getContact
  const getFn = camelCase(['get', key]);

  // retrieve the entity from the service
  // e.g. contactsService.getContact(id)
  const entity = await services[key][getFn](id);

  return entity || Boom.notFound(`No ${key} found for ${id}`);
};

/**
 * Helper function to abstract the basic case of adding an entity
 * to another entity via a route handler
 *
 * @param {Object} request HAPI request object
 * @param {Object} h HAPI response toolkit
 * @param {String} prefixKey The entity type being added to (e.g. company)
 * @param {String} suffixKey The entity type being added (e.g. contact)
 */
const addEntity = async (request, h, prefixKey, suffixKey) => {
  validateKey(prefixKey);
  const key = camelCase([prefixKey, suffixKey]);

  try {
    const addFn = camelCase(['add', key]);
    const data = { ...request.params, ...request.payload };
    const entity = await services[prefixKey][addFn](data);
    const location = urlJoin(request.path, entity[`${key}Id`]);
    return h.response(entity).created(location);
  } catch (error) {
    return mapErrorResponse(error);
  }
};

exports.createEntity = createEntity;
exports.getEntity = getEntity;
exports.addEntity = addEntity;
