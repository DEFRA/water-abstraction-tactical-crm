/* Replace with your SQL commands */
alter table crm_v2.document_roles alter column company_id drop not null;

alter table crm_v2.document_roles 
  add constraint company_or_invoice_account check (
    (company_id is not null and address_id is not null) 
    or invoice_account_id is not null
  );