ALTER TABLE "crm"."entity_roles"
  DROP CONSTRAINT IF EXISTS "unique_role";


CREATE UNIQUE INDEX unique_role ON crm.entity_roles(entity_id, coalesce(regime_entity_id, '00000000-0000-0000-0000-000000000000'), company_entity_id, role);


