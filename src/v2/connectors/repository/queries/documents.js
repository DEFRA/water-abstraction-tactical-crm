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

exports.getDocumentRolesByDocumentRef = `
  select
     roles.role_id as role_id,
     roles.name as role_name,
     roles.label as role_label,
     contacts.contact_id,
     contacts.salutation,
     contacts.first_name,
     contacts.last_name,
     companies.company_id,
     companies.name,
     companies.type,
     addresses.address_id,
     addresses.address_1,
     addresses.address_2,
     addresses.address_3,
     addresses.address_4,
     addresses.town,
     addresses.county,
     addresses.country,
     addresses.postcode from crm_v2.document_roles dr 
  left join crm_v2.companies companies on companies.company_id  = dr.company_id
  left join crm_v2.contacts contacts on contacts.contact_id  = dr.contact_id
  join crm_v2.addresses addresses on addresses.address_id = dr.address_id
  join crm_v2.documents documents on documents.document_id = dr.document_id
  join crm_v2.roles roles on roles.role_id = dr.role_id 
  where documents.document_ref = :documentRef and (dr.end_date is null or dr.end_date > now());
`;

exports.getFullHistoryOfDocumentRolesByDocumentRef = `
select
     roles.role_id as role_id,
     roles.name as role_name,
     roles.label as role_label,
     contacts.contact_id,
     contacts.salutation,
     contacts.first_name,
     contacts.last_name,
     companies.company_id,
     companies.name,
     companies.type,
     addresses.address_id,
     addresses.address_1,
     addresses.address_2,
     addresses.address_3,
     addresses.address_4,
     addresses.town,
     addresses.county,
     addresses.country,
     addresses.postcode,
     dr.start_date,
     dr.end_date from crm_v2.document_roles dr 
  left join crm_v2.companies companies on companies.company_id  = dr.company_id
  left join crm_v2.contacts contacts on contacts.contact_id  = dr.contact_id
  join crm_v2.addresses addresses on addresses.address_id = dr.address_id
  join crm_v2.documents documents on documents.document_id = dr.document_id
  join crm_v2.roles roles on roles.role_id = dr.role_id 
  where documents.document_ref = :documentRef;
`;
