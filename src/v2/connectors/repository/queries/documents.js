exports.findOneById = `
  select *
  from crm_v2.documents
  where document_id = $1
  and date_deleted is null;
`;

exports.findByDocumentRef = `
  select *
  from crm_v2.documents
  where regime = :regime
  and document_type = :documentType
  and document_ref = :documentRef
  and date_deleted is null
  order by start_date, end_date;
`;

exports.findDocumentByRefAndDate = `
  SELECT docs.*, docRoles.company_id, docRoles.contact_id, docRoles.address_id, roles.role_id, roles.name AS role_name
  FROM crm_v2.documents docs
    LEFT JOIN crm_v2.document_roles docRoles
      ON docRoles.document_id=docs.document_id AND company_id IS NOT NULL
    JOIN crm_v2.roles roles
      ON roles.role_id = docRoles.role_id AND roles.name = 'licenceHolder'
  WHERE regime=:regime
  AND document_type=:documentType
  AND document_ref=:documentRef
  AND docs.start_date<=:date
  AND (docs.end_date>=:date OR docs.end_date IS NULL)
  AND docs.date_deleted is null
  ORDER BY docs.start_date, docs.end_date
  LIMIT 1;
`;
