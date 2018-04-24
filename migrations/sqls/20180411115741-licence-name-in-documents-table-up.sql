/* Replace with your SQL commands */
ALTER TABLE "crm"."document_header"
  ADD COLUMN document_name character varying;


/* Update existing data */
UPDATE "crm"."document_header" h
  SET document_name=m.value
  FROM "crm"."entity_document_metadata" m
  WHERE h.document_id=m.document_id AND m.key='name'
