CREATE VIEW "crm"."kpi_view" AS  SELECT 'additional_access_grantees'::text AS datapoint,
   count(*) AS value
   FROM crm.entity_roles
  WHERE (entity_roles.created_by IS NOT NULL)
UNION
 SELECT 'renamed_licences'::text AS datapoint,
   count(*) AS value
   FROM crm.document_header
  WHERE ((document_header.document_name IS NOT NULL) AND ((document_header.company_entity_id)::text <> '4b4a645f-a3ce-7827-e118-50a45ca7c1d1'::text))
UNION
 SELECT 'users_with_multiple_verifications'::text AS datapoint,
   count(*) AS value
   FROM ( SELECT verification.entity_id,
            count(*) AS count
           FROM crm.verification
          GROUP BY verification.entity_id
         HAVING (count(*) > 1)) x;
