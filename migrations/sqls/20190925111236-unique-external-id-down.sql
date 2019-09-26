/* Replace with your SQL commands */
ALTER TABLE "crm_v2"."companies"
  DROP CONSTRAINT unique_external_id;

ALTER TABLE "crm_v2"."companies"
  ALTER COLUMN type SET NOT NULL;

ALTER TABLE "crm_v2"."contacts"
  DROP CONSTRAINT unique_contact_external_id;

ALTER TABLE "crm_v2"."contacts"
  DROP COLUMN initials;

DELETE FROM "crm_v2"."roles" WHERE name='billing';

ALTER TABLE "crm_v2"."company_contacts"
  DROP CONSTRAINT company_role_contact;

ALTER TABLE "crm_v2"."company_contacts"
  ADD CONSTRAINT company_role_contact UNIQUE (company_id, contact_id, role_id);

ALTER TABLE "crm_v2"."invoice_accounts"
  ALTER COLUMN start_date SET NOT NULL;

ALTER TABLE "crm_v2"."invoice_accounts"
  DROP CONSTRAINT invoice_account_company_ias;

ALTER TABLE "crm_v2"."addresses"
  DROP CONSTRAINT unique_address_external_id;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN county SET NOT NULL;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN country SET NOT NULL;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN country TYPE varchar(2);

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN postcode SET NOT NULL;

ALTER TABLE "crm_v2"."addresses"
  ALTER COLUMN town SET NOT NULL;
