/* Replace with your SQL commands */

alter table crm_v2.invoice_account_addresses
  add column agent_company_id uuid default null references crm_v2.companies (company_id);

alter table crm_v2.invoice_account_addresses
  add column contact_id uuid default null references crm_v2.contacts (contact_id);


