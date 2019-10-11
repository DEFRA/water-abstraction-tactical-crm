const { pool } = require('../db');
const queries = require('./queries/document-roles');

class DocumentRolesRepository {
  /**
   * Gets all document roles from DB for specified document
   * @param {String} documentId - GUID
   * @return {Promise<Array>}
   */
  async findByDocumentId (documentId) {
    const params = [documentId];
    const { rows } = await pool.query(queries.findByDocumentId, params);
    return rows;
  }
}

module.exports = DocumentRolesRepository;
