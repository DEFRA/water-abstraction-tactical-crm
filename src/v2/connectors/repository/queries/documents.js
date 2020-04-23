exports.findOneById = `
  select * from crm_v2.documents 
  where document_id=$1
`;

exports.findByDocumentRef = `
  select * from crm_v2.documents
  where regime=:regime and document_type=:documentType and document_ref=:documentRef
  order by start_date, version_number, end_date
`;
