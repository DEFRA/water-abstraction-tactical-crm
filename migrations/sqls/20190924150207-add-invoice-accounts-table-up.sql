/* Replace with your SQL commands */
ALTER TABLE crm_v2.companies DROP COLUMN ias_account_number;

/**
 * Allows one or more invoice accounts to be created for a company.
 * Customers get 1 invoice per invoice account
 */
CREATE TABLE IF NOT EXISTS "crm_v2"."invoice_accounts" (
  "invoice_account_id" varchar NOT NULL DEFAULT public.gen_random_uuid(),
  "company_id" varchar NOT NULL,
  "ias_account_number" varchar NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("invoice_account_id"),
  UNIQUE("ias_account_number"),
  FOREIGN KEY (company_id) REFERENCES crm_v2.companies (company_id)
);

/**
 * Allows an address to be linked to an invoice account over a specified
 * time range
 */
CREATE TABLE IF NOT EXISTS "crm_v2"."invoice_account_addresses" (
  "invoice_account_address_id" varchar NOT NULL DEFAULT public.gen_random_uuid(),
  "invoice_account_id" varchar NOT NULL,
  "address_id" varchar NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("invoice_account_address_id"),
  UNIQUE("invoice_account_id", "start_date"),
  FOREIGN KEY (invoice_account_id) REFERENCES crm_v2.invoice_accounts (invoice_account_id),
  FOREIGN KEY (address_id) REFERENCES crm_v2.addresses (address_id)
);

ALTER TABLE "crm_v2"."document_roles"
  ADD COLUMN "invoice_account_id" varchar;

ALTER TABLE "crm_v2"."document_roles"
  ADD FOREIGN KEY (invoice_account_id) REFERENCES crm_v2.invoice_accounts (invoice_account_id);
