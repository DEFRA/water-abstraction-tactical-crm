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
  ic.company_number AS invoice_company_number,
  iaa.address_id AS invoice_account_address_id,
  iaa.address_1 AS invoice_account_address_1,
  iaa.address_2 AS invoice_account_address_2,
  iaa.address_3 AS invoice_account_address_3,
  iaa.address_4 AS invoice_account_address_4,
  iaa.town AS invoice_account_town,
  iaa.county AS invoice_account_county,
  iaa.country AS invoice_account_country,
  iaa.postcode AS invoice_account_postcode

from crm_v2.document_roles r
join crm_v2.roles r2 ON r.role_id=r2.role_id
left join crm_v2.companies c on r.company_id=c.company_id
left join crm_v2.addresses a on r.address_id=a.address_id
left join crm_v2.contacts c2 on r.contact_id=c2.contact_id
left join crm_v2.invoice_accounts i on r.invoice_account_id=i.invoice_account_id
left join crm_v2.companies ic on i.company_id=ic.company_id
left join (
select iaa.invoice_account_id, a.* 
  from crm_v2.invoice_account_addresses iaa
  join crm_v2.addresses a on iaa.address_id=a.address_id
  where iaa.start_date<=NOW()
  and (iaa.end_date is null or iaa.end_date>NOW())
) iaa on i.invoice_account_id=iaa.invoice_account_id

where document_id=$1
`;
