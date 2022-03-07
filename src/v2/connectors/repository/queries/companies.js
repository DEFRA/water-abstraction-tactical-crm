
exports.findByCompanyNameWithSoftSearch = `
select companies.company_id, companies.name, companies.type from crm_v2.companies companies
where (:soft IS FALSE AND UPPER(name)=UPPER(:name)) OR (:soft IS TRUE AND UPPER(name) LIKE '%' || UPPER(:name) || '%')
order by name ASC
`;

exports.findLicencesByCompanyId = `
  select documents.* from crm_v2.documents 
  join crm_v2.document_roles document_roles on document_roles.document_id = documents.document_id
  where document_roles.company_id = :companyId 
  and (document_roles.end_date is null or document_roles.end_date > NOW())
`;

exports.getCompanyWAAEmailContacts = `
  select c.email from crm_v2.contacts c
  join crm_v2.company_contacts cc on cc.contact_id = c.contact_id 
  join crm_v2.companies c2 on cc.company_id = c2.company_id 
  where c.email is not null 
  and c2.company_id = :companyId
  and cc.water_abstraction_alerts_enabled is true;
`;
