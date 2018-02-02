/* Replace with your SQL commands */

drop index  if exists  "doc_header_index" ;

CREATE UNIQUE INDEX "doc_header_index" ON "crm"."document_header" (
  "document_id",
  "regime_entity_id",
  "system_id",
  "system_internal_id",
  "system_external_id",
  "company_entity_id",
  "verification_id"
);

DROP VIEW if exists "crm"."role_document_access";

CREATE VIEW "crm"."role_document_access" AS   SELECT e.entity_role_id,
    e.role,
    e.created_at,
    e.created_by,
    ei.entity_id AS individual_entity_id,
    ei.entity_nm AS individual_nm,
    ei.entity_definition AS individual_definition,
    ec.entity_nm AS company_nm,
    ei.entity_definition AS company_definition,
    er.entity_nm AS regime_nm,
    ei.entity_definition AS regime_definition,
    hr.document_id,
    hr.regime_entity_id,
    hr.system_id,
    hr.system_internal_id,
    hr.system_external_id,
    hr.company_entity_id,
    hr.verified,
    hr.verification_id
   FROM ((((crm.entity_roles e
     LEFT JOIN crm.entity ei ON (((e.entity_id)::text = (ei.entity_id)::text)))
     LEFT JOIN crm.entity ec ON (((e.company_entity_id)::text = (ec.entity_id)::text)))
     LEFT JOIN crm.entity er ON (((e.regime_entity_id)::text = (er.entity_id)::text)))
     LEFT JOIN crm.document_header hr ON (((((e.regime_entity_id)::text = (hr.regime_entity_id)::text) AND (e.company_entity_id IS NULL)) OR (((e.company_entity_id)::text = (hr.company_entity_id)::text) AND (e.company_entity_id IS NOT NULL)))))
     
