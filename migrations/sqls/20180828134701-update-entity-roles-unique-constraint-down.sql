ALTER TABLE "crm"."entity_roles"
  DROP CONSTRAINT IF EXISTS "unique_role";

ALTER TABLE "crm"."entity_roles"
  ADD CONSTRAINT "unique_role" UNIQUE ("entity_id", "regime_entity_id", "company_entity_id");

