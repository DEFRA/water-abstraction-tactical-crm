
const docService = require('../../services/documents');

const getDocuments = async (request) => {
  const { regime, documentType, documentRef } = request.query;
  return docService.getDocumentsByRef(regime, documentType, documentRef);
};

const getDocumentByRefAndDate = async (request) => {
  const { regime, documentType, documentRef, date } = request.query;
  return docService.getDocumentByRefAndDate(regime, documentType, documentRef, date);
};

exports.getDocuments = getDocuments;
exports.getDocumentByRefAndDate = getDocumentByRefAndDate;