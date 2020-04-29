'use strict';

const urlJoin = require('url-join');
const Boom = require('@hapi/boom');

const { startCase, lowerCase } = require('lodash');
const mapErrorResponse = require('./map-error-response');
const contactsService = require('../services/contacts');
const addressService = require('../services/address');
const documentService = require('../services/documents');
const invoiceAccountsService = require('../services/invoice-accounts');
const documentsService = require('../services/documents');

const services = {
  contact: contactsService,
  address: addressService,
  document: documentService,
  invoiceAccount: invoiceAccountsService,
  documentRole: documentsService
};

const validateKey = key => {
  const knownKeys = Object.keys(services);
  if (!knownKeys.includes(key)) {
    throw new Error(`Unknown key (${key}) passed to entity-handlers`);
  }
};

const getFunctionName = (action, entityKey) => {
  return `${action}${startCase(entityKey)}`.replace(/\s/g, '');
};

/**
 * Helper function to abstract common entity creation for the controllers
 *
 * @param {Object} request HAPI request object
 * @param {Object} h HAPI response toolkit
 * @param {String} key The entity type being created (e.g. contact)
 * @param {Function} locationCallback Optional callback that will recieve the
 *  created entity for greater control when forming the location URL
 */
const createEntity = async (request, h, key, locationCallback) => {
  validateKey(key);

  try {
    const createFn = getFunctionName('create', key);

    const data = { ...request.params, ...request.payload };
    const entity = await services[key][createFn](data);

    const location = locationCallback
      ? locationCallback(entity)
      : urlJoin(request.path, entity[`${key}Id`]);

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
  const getFn = getFunctionName('get', key);

  // retrieve the entity from the service
  // e.g. contactsService.getContact(id)
  const entity = await services[key][getFn](id);

  return entity || Boom.notFound(`No ${lowerCase(key)} found for ${id}`);
};

exports.createEntity = createEntity;
exports.getEntity = getEntity;
