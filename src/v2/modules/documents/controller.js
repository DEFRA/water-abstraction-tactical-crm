const docService = require('../../services/documents');

const getDocuments = async (request) => {
  const { regime, documentType, documentRef } = request.query;
  return docService.getDocumentsByRef(regime, documentType, documentRef);
};

const getDocumentByRefAndDate = async (request) => {
  const { regime, documentType, documentRef, date } = request.query;
  return docService.getDocumentByRefAndDate(regime, documentType, documentRef, date);
};

const getDocumentRolesByDocumentRef = async request => {
  const { documentRef } = request.params;
  const { includeHistoricRoles } = request.query;
  return docService.getDocumentRolesByDocumentRef(decodeURIComponent(documentRef), includeHistoricRoles);
};

exports.getDocuments = getDocuments;
exports.getDocumentByRefAndDate = getDocumentByRefAndDate;
exports.getDocumentRolesByDocumentRef = getDocumentRolesByDocumentRef;
