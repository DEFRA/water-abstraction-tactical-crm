const { pool } = require('../lib/connectors/db');

/**
 * Post a list of document IDs that apply to a verification
 * @param {Object} request HAPI request
 * @param {String} request.params.id verification ID
 * @param {Array} request.payload.document_id list of document IDs to insert
 * @param {Object} reply HAPI reply
 */
async function postVerificationDocuments(request, reply) {
  const { id } = request.params;
  const { document_id : documentId } = request.payload;

  let query = `INSERT INTO crm.verification_documents (verification_id, document_id) VALUES `;
  const rows = [];
  const params = [id];
  documentId.forEach((docId) => {
    params.push(docId);
    rows.push(`($1, $${ params.length})`)
  });

  query += rows.join(',');

  try {
    const {rows : data} = await pool.query(query, params);
    return reply({error : null}).code(200);
  }
  catch(error) {
    console.log(error);
    reply({error, data : null}).code(500);
  }
}

/**
 * Get a list of documents for the specified verification
 * @param {Object} request HAPI request
 * @param {String} request.params.id verification ID
 * @param {Object} reply HAPI reply
 */
async function getVerificationDocuments(request, reply) {
  const { id } = request.params;
  const query = `SELECT * FROM crm.verification_documents WHERE verification_id=$1`;
  const params = [id];
  try {
    const {rows : data} = await pool.query(query, params);
    return reply({error : null, data}).code(200);
  }
  catch(error) {
    console.log(error);
    reply({error, data : null}).code(500);
  }
}

module.exports = {
  postVerificationDocuments,
  getVerificationDocuments
}
