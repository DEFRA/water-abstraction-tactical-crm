
const docService = require('../../services/documents');

const getDocuments = async (request) => {
  const { regime, documentType, documentRef } = request.query;
  return docService.getDocumentsByRef(regime, documentType, documentRef);
};

exports.getDocuments = getDocuments;
