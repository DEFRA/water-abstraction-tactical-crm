
exports.findByCompanyNameWithSoftSearch = `
select companies.company_id, companies.name, companies.type from crm_v2.companies companies
where (:soft IS FALSE AND UPPER(name)=UPPER(:name)) OR (:soft IS TRUE AND UPPER(name) LIKE '%' || UPPER(:name) || '%')
order by name ASC
`;

exports.findLicencesByCompanyId = `
  select documents.* from crm_v2.documents 
  join crm_v2.document_roles document_roles on document_roles.document_id = documents.document_id
  join crm_v2.roles r on r.role_id = dr.role_id
  where document_roles.company_id = :companyId 
`;
