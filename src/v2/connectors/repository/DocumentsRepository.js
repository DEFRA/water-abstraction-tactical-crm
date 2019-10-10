const { pool } = require('../../../lib/connectors/db');
const queries = require('./queries/documents');

class DocumentsRepository {
  /**
   * Find a single document record by its GUID
   * @param {String} documentId - GUID
   */
  async findOneById (documentId) {
    const params = [documentId];
    const { rows: [row] } = await pool.query(queries.findOneById, params);
    return row;
  }

  /**
   * Get all documents with a particular document reference in date/version order
   * @param {String} regime - the regime, e.g. 'water'
   * @param {String} documentType - the type of document, e.g. abstraction_licence
   * @param {String} documentRef - licence/permit number
   */
  async findByDocumentRef (regime, documentType, documentRef) {
    const params = [regime, documentType, documentRef];
    const { rows } = await pool.query(queries.findByDocumentRef, params);
    return rows;
  }
}

module.exports = DocumentsRepository;
