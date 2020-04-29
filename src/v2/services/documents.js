'use strict';
const repo = require('../connectors/repository');
const errors = require('../lib/errors');
const moment = require('moment');
const Boom = require('@hapi/boom');
const mappers = require('../mappers');
const { omit } = require('lodash');

const documentValidator = require('../modules/documents/validator');
const documentRoleRepo = require('../connectors/repository/document-roles');
const rolesRepo = require('../connectors/repository/roles');

const datesOverlap = (list, item) => {
  return list.map(row => {
    const rangeA = moment.range(item.startDate, item.endDate);
    const rangeB = moment.range(row.startDate, row.endDate);
    return !!(rangeA.intersect(rangeB));
  }).includes(true);
};

const createDocument = async document => {
  const { error, value: validatedDocument } = documentValidator.validatedDocument(document);

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

/**
 * Replaces the role name with the role id in the data ready for
 * persisting to the data store.
 *
 * @param {Object} documentRole The incoming request data for a proposed document role record
 */
const replaceRoleNameWithRoleId = async documentRole => {
  const roleEntity = await rolesRepo.findOneByName(documentRole.role);

  return {
    roleId: roleEntity.roleId,
    ...omit(documentRole, 'role')
  };
};

/*
 * Attempts to create a new document role entry. Will only save if:
 *
 * The data is valid
 * The date range does not overlap with another entry for the
 * role type and document id
 *
 * @param {Object} documentRole The document role data to persist
 */
const createDocumentRole = async documentRole => {
  const { error, value: validatedDocumentRole } = documentValidator.validateDocumentRole(documentRole);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new errors.EntityValidationError('Document Role not valid', details);
  }

  // get the existing document roles for the document and role
  const allDocumentRoles = await documentRoleRepo.findByDocumentId(documentRole.documentId);

  if (datesOverlap(allDocumentRoles, validatedDocumentRole)) {
    throw new errors.ConflictingDataError('Existing document role exists for date range');
  }

  const documentRoleToSave = await replaceRoleNameWithRoleId(validatedDocumentRole);

  return documentRoleRepo.create(documentRoleToSave);
};

const getDocumentRole = documentRoleId => documentRoleRepo.findOne(documentRoleId);

exports.createDocumentRole = createDocumentRole;
exports.getDocumentRole = getDocumentRole;
exports.createDocument = createDocument;
exports.getDocument = getDocument;
exports.getDocumentByRef = getDocumentByRef;
