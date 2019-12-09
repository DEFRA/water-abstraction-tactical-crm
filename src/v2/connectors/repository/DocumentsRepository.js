const queries = require('./queries/documents');
const Repository = require('./Repository');

class DocumentsRepository extends Repository {
  /**
   * Find a single document record by its GUID
   * @param {String} documentId - GUID
   */
  async findOneById (documentId) {
    return this.findOne(queries.findOneById, [documentId]);
  }

  /**
   * Get all documents with a particular document reference in date/version order
   * @param {String} regime - the regime, e.g. 'water'
   * @param {String} documentType - the type of document, e.g. abstraction_licence
   * @param {String} documentRef - licence/permit number
   */
  async findByDocumentRef (regime, documentType, documentRef) {
    const params = [regime, documentType, documentRef];
    return this.findMany(queries.findByDocumentRef, params);
  }
}

module.exports = DocumentsRepository;
