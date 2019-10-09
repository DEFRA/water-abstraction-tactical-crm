/* Replace with your SQL commands */
ALTER TABLE "crm_v2"."companies"
  ADD CONSTRAINT unique_external_id UNIQUE (external_id);

ALTER TABLE "crm_v2"."companies"
  ALTER COLUMN "type" DROP NOT NULL;

ALTER TABLE "crm_v2"."contacts"
  ADD CONSTRAINT unique_contact_external_id UNIQUE (external_id);

ALTER TABLE "crm_v2"."contacts"
  ADD COLUMN initials VARCHAR;

INSERT INTO "crm_v2"."roles"
  (name, date_created, date_updated)
  VALUES ('billing', NOW(), NOW());

ALTER TABLE "crm_v2"."company_contacts"
  DROP CONSTRAINT company_role_contact;

ALTER TABLE "crm_v2"."company_contacts"
  ADD CONSTRAINT company_role_contact UNIQUE (company_id, contact_id, role_id, start_date);

ALTER TABLE "crm_v2"."invoice_accounts"
  ALTER COLUMN start_date DROP NOT NULL;

ALTER TABLE "crm_v2"."invoice_accounts"
  ADD CONSTRAINT invoice_account_company_ias UNIQUE (company_id, ias_account_number);

ALTER TABLE "crm_v2"."addresses"
  ADD CONSTRAINT unique_address_external_id UNIQUE (external_id);

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN county DROP NOT NULL;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN country DROP NOT NULL;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN country TYPE varchar;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN postcode DROP NOT NULL;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN town DROP NOT NULL;

ALTER TABLE "crm_v2"."document_roles"
  DROP CONSTRAINT document_role_contact;

ALTER TABLE "crm_v2"."document_roles"
  ADD CONSTRAINT document_billing_role UNIQUE(document_id, company_id, invoice_account_id, role_id, start_date);
