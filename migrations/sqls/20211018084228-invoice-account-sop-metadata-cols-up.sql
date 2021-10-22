alter table crm_v2.invoice_accounts add column last_transaction_file_reference VARCHAR default null;
alter table crm_v2.invoice_accounts add column date_last_transaction_file_reference_updated TIMESTAMP default null;
