/* Replace with your SQL commands */
DELETE FROM "crm_v2"."roles" WHERE name='licenceHolder';

ALTER TABLE "crm_v2"."document_roles"
  DROP CONSTRAINT document_role_starts;

ALTER TABLE "crm_v2"."document_roles"
  ADD CONSTRAINT document_billing_role UNIQUE(document_id, company_id, invoice_account_id, role_id, start_date);
