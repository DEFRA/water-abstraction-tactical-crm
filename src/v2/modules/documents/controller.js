const Boom = require('@hapi/boom');
const camelCaseKeys = require('../../../lib/camel-case-keys');
const repositories = require('../../connectors/repository');
const mappers = require('./lib/mappers');

const getDocuments = async (request) => {
  const { regime, documentType, documentRef } = request.query;
  const data = await repositories.documents.findByDocumentRef(regime, documentType, documentRef);
  return data;
};

const getDocument = async (request, h) => {
  const { documentId } = request.params;

  // Load document and roles from DB
  const [doc, roles] = await Promise.all([
    repositories.documents.findOne(documentId),
    repositories.documentRoles.findByDocumentId(documentId)
  ]);

  if (!doc) {
    throw Boom.notFound(`Document ${documentId} not found`);
  }

  // Map data
  return {
    ...camelCaseKeys(doc),
    documentRoles: roles.map(mappers.mapDocumentRole)
  };
};

const postDocuments = async (request) => {
  // check before creation that the date range does not overlap an existing document
  // with the same regime, documentType and documentRef.  If it does, we should respond with a 409
};

exports.postDocuments = postDocuments;
exports.getDocuments = getDocuments;
exports.getDocument = getDocument;
