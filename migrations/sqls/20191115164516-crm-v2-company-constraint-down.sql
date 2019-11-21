/* Replace with your SQL commands */
alter table crm_v2.document_roles 
  drop constraint company_or_invoice_account;

alter table crm_v2.document_roles alter column company_id set not null;