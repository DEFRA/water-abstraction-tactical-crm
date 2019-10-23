exports.findOneById = `
  select * from crm_v2.documents 
  where document_id=$1
`;

exports.findByDocumentRef = `
  select * from crm_v2.documents
  where regime=$1 and document_type=$2 and document_ref=$3
  order by start_date, version_number, end_date
`;
