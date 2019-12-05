-- Remove the increment from the end of the external ID
-- e.g. 4:3:2:1 becomes 4:3:2

update crm_v2.documents
set
  external_id = regexp_replace(external_id, ':(\d*)$', ''),
  date_updated = now();
