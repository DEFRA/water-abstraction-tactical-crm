'use strict';

const Document = require('../bookshelf/Document');
const helpers = require('./helpers');
const queries = require('./queries/documents');
const raw = require('./lib/raw');

/**
 * Find single Document by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => helpers.findOne(Document, 'documentId', id);

/**
   * Get all documents with a particular document reference in date/version order
   * @param {String} regime - the regime, e.g. 'water'
   * @param {String} documentType - the type of document, e.g. abstraction_licence
   * @param {String} documentRef - licence/permit number
   */
const findByDocumentRef = (regime, documentType, documentRef) =>
  raw.multiRow(queries.findByDocumentRef, { regime, documentType, documentRef });

/**
 * Create a new Document in crm_v2.documents
 *
 * @param {Object} document An object to persist to crm_v2.documents
 * @returns {Object} The created document from the database
 */
const create = async document => helpers.create(Document, document);

const deleteTestData = async () => helpers.deleteTestData(Document);

exports.findByDocumentRef = findByDocumentRef;
exports.findOne = findOne;
exports.create = create;
exports.deleteTestData = deleteTestData;
