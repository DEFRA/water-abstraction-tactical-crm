exports.findOneById = `
  select * from crm_v2.documents 
  where document_id=$1
`;

exports.findByDocumentRef = `
  select * from crm_v2.documents
  where regime=:regime and document_type=:documentType and document_ref=:documentRef
  order by start_date, version_number, end_date
`;

exports.findDocumentByRefAndDate = `
  SELECT * FROM crm_v2.documents
  WHERE regime=:regime
  AND document_type=:documentType
  AND document_ref=:documentRef
  AND start_date<=:date
  AND (end_date>=:date OR end_date IS NULL)
  ORDER BY start_date, version_number, end_date
  LIMIT 1;
`