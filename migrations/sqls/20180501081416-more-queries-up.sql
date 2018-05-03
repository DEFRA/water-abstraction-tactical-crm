DROP VIEW if exists "crm"."kpi_view";

CREATE VIEW "crm"."kpi_view" AS  SELECT 'additional_access_grantees'::text AS datapoint,
    count(*) AS value,'Users granted access by another user' as description
   FROM crm.entity_roles
  WHERE (entity_roles.created_by IS NOT NULL)
UNION
 SELECT 'renamed_licences'::text AS datapoint,
    count(*) AS value, 'Licences given a custom name (includes Severn Trent)' as description
   FROM crm.document_header
  WHERE ((document_header.document_name IS NOT NULL)
	-- AND ((document_header.company_entity_id)::text <> '4b4a645f-a3ce-7827-e118-50a45ca7c1d1'::text)
	)
UNION
 SELECT 'users_with_multiple_verifications'::text AS datapoint,
    count(*) AS value, 'Users you have verified multiple batches of licences' as description
   FROM ( SELECT verification.entity_id,
            count(*) AS count
           FROM crm.verification
          GROUP BY verification.entity_id
         HAVING (count(*) > 1)) x
 union
 SELECT 'verifications_started_this_month'::text AS datapoint,
    count(*) AS value, 'Verification flows started this calender month' as description
		from crm.verification where date_trunc('month', current_date) = date_trunc('month', date_created)
union
SELECT 'verifications_started_last_month'::text AS datapoint,
    count(*) AS value, 'Verification flows started last calender month' as description
		from crm.verification where date_trunc('month', current_date - interval '1' month) = date_trunc('month', date_created)
union
SELECT 'verifications_completed_this_month'::text AS datapoint,
    count(*) AS value, 'Verification flows completed this calender month' as description
		from crm.verification where date_trunc('month', current_date) = date_trunc('month', date_verified)
union
SELECT 'verifications_completed_last_month'::text AS datapoint,
    count(*) AS value, 'Verification flows completed last calender month' as description
		from crm.verification where date_trunc('month', current_date - interval '1' month) = date_trunc('month', date_verified)
