/*
  https://eaflood.atlassian.net/browse/WATER-5495

  Add a region_id column to the companies table, and populate the existing records.

  The water-abstraction-import will handle populating it for new ones it creates.
 */

ALTER TABLE crm_v2.companies ADD COLUMN IF NOT EXISTS region_id UUID;

DO $$
BEGIN
  IF EXISTS
    (
      SELECT
        1
      FROM
        information_schema.tables
      WHERE
        table_schema = 'water'
        AND table_name = 'regions'
    )
  THEN
    WITH subquery AS (
      SELECT
        c.company_id,
        r.region_id
      FROM
        crm_v2.companies c
      INNER JOIN water.regions r
        ON r.nald_region_id::text = left(c.external_id, 1)
    )
    UPDATE crm_v2.companies c
    SET
      region_id = subquery.region_id
    FROM
      subquery
    WHERE
      c.company_id = subquery.company_id;
  END IF;
END
$$;
