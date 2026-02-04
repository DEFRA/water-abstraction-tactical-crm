ALTER TABLE crm_v2.company_contacts
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by;
