const { pool } = require('../lib/connectors/db')
const mongoSql = require('mongo-sql')
const { logger } = require('../logger')

/**
 * Get verifications by document id
 * Gets a list of verifications and the documents they apply to
 */
async function getVerificationsByDocumentID (request, h) {
  try {
    const filter = JSON.parse(request.query.filter || '{}')

    const query = {
      type: 'select',
      table: 'crm.verification_documents',
      columns: [
        'crm.verification_documents.document_id',
        'crm.verification_documents.verification_id',
        'crm.verification.verification_id',
        'crm.verification.entity_id',
        'crm.verification.verification_code',
        'crm.verification.method',
        'crm.verification.date_created',
        'crm.verification.date_verified',
        'crm.verification.company_entity_id',
        'crm.entity.entity_nm'
      ],
      where: filter,
      joins: [
        // Join on the junction table to get all users books ids
        {
          type: 'left',
          target: 'crm.verification',
          on: {
            verification_id: '$verification_documents.verification_id$'
          }
        },
        {
          type: 'left',
          target: 'crm.entity',
          on: {
            entity_id: '$crm.verification.entity_id$'
          }
        }
      ]
    }
    const result = mongoSql.sql(query)

    const { rows, error } = await pool.query(result.toString(), result.values)

    return { error, data: rows }
  } catch (error) {
    logger.error('getVerificationsByDocumentID error', error)
    h.response({ error, data: null }).statusCode(500)
  }
}

module.exports = {
  getVerificationsByDocumentID
}
