const queries = require('./queries/document-roles');
const Repository = require('./Repository');

class DocumentRolesRepository extends Repository {
  /**
   * Gets all document roles from DB for specified document
   * @param {String} documentId - GUID
   * @return {Promise<Array>}
   */
  async findByDocumentId (documentId) {
    return this.findMany(queries.findByDocumentId, [documentId]);
  }
}

module.exports = DocumentRolesRepository;
