exports.findByDocumentId = `
select
  r.*,
  r2.name AS role_name,
  c.company_number, c.name, c.type AS company_type,
  a.address_1, a.address_2, a.address_3, a.address_4, a.town, a.county, a.postcode, a.country,
  c2.salutation, c2.first_name, c2.middle_names, c2.last_name, c2.initials,
  i.invoice_account_number,
  ic.company_number as invoice_number,
  ic.company_id AS invoice_company_id,
  ic.name AS invoice_company_name,
  ic.company_number AS invoice_company_number

from crm_v2.document_roles r
join crm_v2.roles r2 ON r.role_id=r2.role_id
left join crm_v2.companies c on r.company_id=c.company_id
left join crm_v2.addresses a on r.address_id=a.address_id
left join crm_v2.contacts c2 on r.contact_id=c2.contact_id
left join crm_v2.invoice_accounts i on r.invoice_account_id=i.invoice_account_id
left join crm_v2.companies ic on i.company_id=ic.company_id

where document_id=$1
`;
