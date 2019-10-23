const Boom = require('@hapi/boom');

const repositories = require('../../connectors/repository');
const mappers = require('./lib/mappers');

const getDocuments = async (request) => {
  const { regime, documentType, documentRef } = request.query;
  const data = await repositories.documents.findByDocumentRef(regime, documentType, documentRef);
  return data.map(mappers.camelCaseKeys);
};

const getDocument = async (request, h) => {
  const { documentId } = request.params;

  // Load document and roles from DB
  const [doc, roles] = await Promise.all([
    repositories.documents.findOneById(documentId),
    repositories.documentRoles.findByDocumentId(documentId)
  ]);

  if (!doc) {
    throw Boom.notFound(`Document ${documentId} not found`);
  }

  // Map data
  return {
    ...mappers.camelCaseKeys(doc),
    documentRoles: roles.map(mappers.mapDocumentRole)
  };
};

exports.getDocuments = getDocuments;
exports.getDocument = getDocument;
