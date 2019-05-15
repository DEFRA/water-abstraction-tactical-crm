const { pool } = require('../lib/connectors/db');
const { logger } = require('@envage/water-abstraction-helpers');

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
    logger.error('postVerificationDocuments error', error);
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
    logger.error('getVerificationDocuments error', error);
    h.response({ error, data: null }).code(500);
  }
}

const deleteVerificationDocuments = async (request, h) => {
  const params = [request.params.id];
  const query = 'delete from crm.verification_documents where verification_id = $1';

  try {
    await pool.query(query, params);
    return h.response().code(204);
  } catch (error) {
    logger.error('getVerificationDocuments error', error);
    h.response({ error, data: null }).code(500);
  }
};

const getUserVerificationsQuery = `
  select
      v.verification_id,
      v.company_entity_id,
      v.verification_code,
      v.date_created,
      vd.document_id,
      dh.system_external_id as licence_ref
  from crm.verification v
      inner join crm.verification_documents vd
          on vd.verification_id = v.verification_id
      inner join crm.document_header dh
          on vd.document_id = dh.document_id
  where v.entity_id = $1
  and v.date_verified is null
  order by v.date_created;`;

const getDocumentDetailsForUserVerification = resultRow => ({
  licenceRef: resultRow.licence_ref,
  documentId: resultRow.document_id
});

const getUserVerifications = async (request, h) => {
  const params = [request.params.entity_id];

  try {
    const result = await pool.query(getUserVerificationsQuery, params);
    const data = result.rows.reduce((acc, row) => {
      const existing = acc.find(v => v.id === row.verification_id);
      const verificationDocumentDetails = getDocumentDetailsForUserVerification(row);

      if (existing) {
        existing.documents.push(verificationDocumentDetails);
        return acc;
      }

      const verification = {
        id: row.verification_id,
        companyEntityId: row.company_entity_id,
        code: row.verification_code,
        dateCreated: row.date_created,
        documents: [verificationDocumentDetails]
      };

      return [...acc, verification];
    }, []);

    return { data, error: null };
  } catch (error) {
    logger.error('getVerificationDocuments error', error);
    h.response({ error, data: null }).code(500);
  }
};

module.exports = {
  postVerificationDocuments,
  getVerificationDocuments,
  deleteVerificationDocuments,
  getUserVerifications
};
