const { DocumentHeadersRepository } = require('./document-header-repo');
const { pool } = require('../connectors/db');

const docHeadersRepo = new DocumentHeadersRepository({
  connection: pool,
  table: 'crm.document_header',
  primaryKey: 'document_id'
});

exports.docHeadersRepo = docHeadersRepo;
