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
  SELECT docs.*, docRoles.company_id, roles.role_id, roles.name FROM crm_v2.documents docs
  LEFT JOIN crm_v2.document_roles docRoles ON docRoles.document_id=docs.document_id AND company_id IS NOT NULL
  JOIN crm_v2.roles roles ON roles.role_id = docRoles.role_id
  WHERE regime=:regime
  AND document_type=:documentType
  AND document_ref=:documentRef
  AND docs.start_date<=:date
  AND (docs.end_date>=:date OR docs.end_date IS NULL)
  ORDER BY docs.start_date, version_number, docs.end_date
  LIMIT 1;
`;
