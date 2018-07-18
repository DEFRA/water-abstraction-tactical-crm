const { pool } = require('../lib/connectors/db');

/**
 * Post a list of document IDs that apply to a verification
 * @param {Object} request HAPI request
 * @param {String} request.params.id verification ID
 * @param {Array} request.payload.document_id list of document IDs to insert
 * @param {Object} h HAPI response toolkit
 */
async function postVerificationDocuments (request, h) {
  const { id } = request.params;
  const { document_id: documentId } = request.payload;

  let query = `INSERT INTO crm.verification_documents (verification_id, document_id) VALUES `;
  const rows = [];
  const params = [id];
  documentId.forEach((docId) => {
    params.push(docId);
    rows.push(`($1, $${params.length})`);
  });

  query += rows.join(',');

  try {
    const { rows: data } = await pool.query(query, params);
    return { error: null, data };
  } catch (error) {
    console.log(error);
    h.response({ error, data: null }).code(500);
  }
}

/**
 * Get a list of documents for the specified verification
 * @param {Object} request HAPI request
 * @param {String} request.params.id verification ID
 * @param {Object} h HAPI response toolkit
 */
async function getVerificationDocuments (request, h) {
  const { id } = request.params;
  const query = `SELECT * FROM crm.verification_documents WHERE verification_id=$1`;
  const params = [id];
  try {
    const { rows: data } = await pool.query(query, params);
    return { error: null, data };
  } catch (error) {
    console.log(error);
    h.response({ error, data: null }).code(500);
  }
}

module.exports = {
  postVerificationDocuments,
  getVerificationDocuments
};
