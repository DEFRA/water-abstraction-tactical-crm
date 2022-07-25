exports.findOneByGreatestAccountNumber = `
select ia.invoice_account_number 
  from crm_v2.invoice_accounts ia
  where ia.invoice_account_number ilike :query
    and ia.is_test=false 
  order by regexp_replace(ia.invoice_account_number, '[^0-9]+', '', 'g')::integer desc 
  limit 1
`

exports.findAllWhereEntitiesHaveUnmatchingHashes = `
select distinct ia.invoice_account_id, ia.invoice_account_number, com.external_id as company_legacy_id
from crm_v2.invoice_accounts ia
left join crm_v2.invoice_account_addresses iaa on iaa.invoice_account_id = ia.invoice_account_id
left join crm_v2.companies com on ia.company_id = com.company_id or iaa.agent_company_id = com.company_id
left join crm_v2.company_contacts comcon on comcon.company_id = com.company_id
left join crm_v2.company_addresses comadd on comadd.company_id = com.company_id
left join crm_v2.contacts con on con.contact_id = comcon.contact_id or con.contact_id = iaa.contact_id 
left join crm_v2.addresses add on add.address_id = iaa.address_id or comadd.address_id = add.address_id
where com.last_hash <> com.current_hash
or con.last_hash <> con.current_hash
or add.last_hash <> add.current_hash
`

exports.deleteTestInvoiceAccounts = `
DELETE from crm_v2.invoice_accounts where company_id IN (SELECT company_id from crm_v2.companies where is_test = true);`

exports.updateInvoiceAccountsWithCustomerFileReference = `
UPDATE crm_v2.invoice_accounts SET 
last_transaction_file_reference = :fileReference,
date_last_transaction_file_reference_updated = :exportedAt
WHERE invoice_account_number = ANY(string_to_array(:exportedCustomers, ','))
`
