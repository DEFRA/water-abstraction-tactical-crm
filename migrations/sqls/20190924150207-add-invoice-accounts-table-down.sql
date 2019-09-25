/* Replace with your SQL commands */
ALTER TABLE crm_v2.companies ADD COLUMN ias_account_number varchar;

DROP TABLE IF EXISTS "crm_v2"."invoice_account_addresses";

DROP TABLE IF EXISTS "crm_v2"."invoice_accounts";
