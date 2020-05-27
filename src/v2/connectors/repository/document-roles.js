'use strict';

const DocumentRole = require('../bookshelf/DocumentRole');
const helpers = require('./helpers');

/**
 * Find single DocumentRole by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => helpers.findOne(
  DocumentRole,
  'documentRoleId',
  id,
  ['role', 'document']
);

/**
 * Create a new document role in crm_v2.document_roles
 *
 * @param {Object} documentRole An object to persist to crm_v2.document_roles
 * @returns {Object} The created address from the database
 */
const create = async documentRole => helpers.create(DocumentRole, documentRole);

const findByDocumentId = async documentId => {
  const documentRoles = await DocumentRole
    .collection()
    .where({ document_id: documentId })
    .fetch({
      withRelated: ['role']
    });

  return documentRoles.toJSON();
};

const deleteTestData = async () => helpers.deleteTestData(DocumentRole);

exports.create = create;
exports.deleteTestData = deleteTestData;
exports.findByDocumentId = findByDocumentId;
exports.findOne = findOne;
