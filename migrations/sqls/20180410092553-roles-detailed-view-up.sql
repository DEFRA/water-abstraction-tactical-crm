CREATE or replace VIEW "crm"."entity_roles_view" AS
SELECT e.entity_nm,
    e.entity_type,
    r.entity_role_id,
    r.entity_id,
    r.role,
    r.regime_entity_id,
    r.company_entity_id
   FROM (crm.entity_roles r
     JOIN crm.entity e ON (((r.entity_id)::text = (e.entity_id)::text)));
