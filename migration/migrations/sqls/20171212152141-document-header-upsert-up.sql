ALTER TABLE "crm"."document_header"
  ADD CONSTRAINT "external_key" UNIQUE ("system_id", "system_internal_id", "regime_entity_id");
