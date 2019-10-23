/* Replace with your SQL commands */
INSERT INTO "crm_v2"."roles"
  (name, date_created, date_updated)
  VALUES ('licenceHolder', NOW(), NOW());

ALTER TABLE "crm_v2"."document_roles"
  DROP CONSTRAINT document_billing_role;


/* remove any duplicate document roles so constraint can be added */
DELETE FROM crm_v2.document_roles WHERE document_role_id IN 
(
  SELECT r1.document_role_id FROM crm_v2.document_roles r1 
  JOIN crm_v2.document_roles r2 ON r1.document_role_id<>r2.document_role_id AND r1.document_id=r2.document_id AND r1.role_id=r2.role_id AND r1.start_date=r2.start_date
  ORDER BY r1.document_id
);
  
ALTER TABLE "crm_v2"."document_roles"
  ADD CONSTRAINT document_role_starts UNIQUE(document_id, role_id, start_date);
