alter table crm_v2.companies
  drop column is_test;

alter table crm_v2.addresses
  drop column is_test;

alter table crm_v2.company_addresses
  drop column is_test;

alter table crm_v2.contacts
  drop column is_test;

alter table crm_v2.company_contacts
  drop column is_test;

alter table crm_v2.documents
  drop column is_test;

alter table crm_v2.document_roles
  drop column is_test;

alter table crm_v2.invoice_accounts
  drop column is_test;

alter table crm_v2.invoice_account_addresses
  drop column is_test;
