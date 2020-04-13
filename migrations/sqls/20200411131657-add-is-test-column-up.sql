alter table crm_v2.companies
  add column is_test boolean not null default false;

alter table crm_v2.addresses
  add column is_test boolean not null default false;

alter table crm_v2.company_addresses
  add column is_test boolean not null default false;

alter table crm_v2.contacts
  add column is_test boolean not null default false;

alter table crm_v2.company_contacts
  add column is_test boolean not null default false;

alter table crm_v2.documents
  add column is_test boolean not null default false;

alter table crm_v2.document_roles
  add column is_test boolean not null default false;

alter table crm_v2.invoice_accounts
  add column is_test boolean not null default false;

alter table crm_v2.invoice_account_addresses
  add column is_test boolean not null default false;
