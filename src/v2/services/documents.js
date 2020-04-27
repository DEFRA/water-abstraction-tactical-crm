'use strict';

const documentValidator = require('../modules/documents/validator');
const repo = require('../connectors/repository');
const errors = require('../lib/errors');
const moment = require('moment');
const Boom = require('@hapi/boom');
const mappers = require('../mappers');

const datesOverlap = (documents, document) => {
  return documents.map(row => {
    const rangeA = moment.range(document.startDate, document.endDate);
    const rangeB = moment.range(row.startDate, row.endDate);
    return !!(rangeA.intersect(rangeB));
  }).includes(true);
};

const createDocument = async document => {
  const { error, value: validatedDocument } = documentValidator.validate(document);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new errors.EntityValidationError('Document not valid', details);
  }

  // get the existing documents for the document ref
  const currentDocuments = await repo.documents.findByDocumentRef(document.regime, document.documentType, document.documentRef);
  if (datesOverlap(currentDocuments, document)) {
    throw new errors.UniqueConstraintViolation('Overlapping start and end date for document reference: ' + document.documentRef);
  }
  return repo.documents.create(validatedDocument);
};

const getDocument = async documentId => {
  // Load document and roles from DB
  const [doc, roles] = await Promise.all([
    await repo.documents.findOne(documentId),
    await repo.documentRoles.findByDocumentId(documentId)
  ]);

  if (!doc) {
    throw Boom.notFound(`Document ${documentId} not found`);
  }

  // Map data
  return {
    doc,
    documentRoles: roles.map(mappers.mapDocumentRole)
  };
};

/**
 * Gets all the documents where the regime, type and reference matches.
 * @param {*} regime
 * @param {*} documentType
 * @param {*} documentRef
 * @returns collection of document objects
 */
const getDocumentByRef = async (regime, documentType, documentRef) => {
  const data = await repo.documents.findByDocumentRef(regime, documentType, documentRef);
  return data;
};

exports.createDocument = createDocument;
exports.getDocument = getDocument;
exports.getDocumentByRef = getDocumentByRef;
