const { pool } = require('../../../lib/connectors/db');
const queries = require('./queries/document-roles');

class DocumentRolesRepository {
  async findByDocumentId (documentId) {
    const params = [documentId];
    const { rows } = await pool.query(queries.findByDocumentId, params);
    return rows;
  }
}

module.exports = DocumentRolesRepository;
