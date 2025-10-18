/*
  https://eaflood.atlassian.net/browse/WATER-5344

  The business reported an issue when viewing a billing account. Our error page was shown whenever they tried to view
  it.

  After checking, we found that the `crm_v2.invoice_accounts` record was created, but the
  `crm_v2.invoice_account_addresses` record, nor the `crm_v2.addresses` and `crm_v2.contacts` records were created.

  Hence, the page is throwing an error because it assumes they will be.

  This migration adds the missing data.

  We also checked for any more invoice account records with missing data. There were 26 others, but none of those were
  linked to a charge version, so they can and should be deleted.
 */

BEGIN;

INSERT INTO crm_v2.addresses (
  address_id,
  address_1,
  address_2,
  address_3,
  address_4,
  town,
  county,
  postcode,
  country,
  date_created,
  date_updated,
  data_source,
  uprn
)
SELECT
  '60672aa2-a431-4b1c-98ad-4be92c073f40'::uuid,
  'WICK QUARRY',
  NULL,
  'LONDON ROAD',
  'WICK',
  'BRISTOL',
  NULL,
  'BS30 5SJ',
  'United Kingdom',
  '2025-09-16 15:26:20.853',
  '2025-09-16 15:26:20.853',
  'wrls'::crm_v2.data_source,
  670731
WHERE EXISTS (
  SELECT 1 FROM crm_v2.invoice_accounts ia WHERE ia.invoice_account_id = '762fe57e-61c9-4db4-b0fd-160e8dff20dd'
);

INSERT INTO crm_v2.contacts (
  contact_id,
  first_name,
  last_name,
  date_created,
  date_updated,
  data_source,
  contact_type,
  suffix
)
SELECT
  'cc5d3c53-7eea-4019-b968-a36f756f4cc0'::uuid,
  'Matt',
  'Knight',
  '2025-09-16 15:26:20.853',
  '2025-09-16 15:26:20.853',
  'wrls'::crm_v2.data_source,
  'person'::crm_v2.contact_type,
  'Quarry Manager'
WHERE EXISTS (
  SELECT 1 FROM crm_v2.invoice_accounts ia WHERE ia.invoice_account_id = '762fe57e-61c9-4db4-b0fd-160e8dff20dd'
);

INSERT INTO crm_v2.invoice_account_addresses (
  invoice_account_id,
  address_id,
  start_date,
  date_created,
  date_updated,
  contact_id
)
SELECT
  '762fe57e-61c9-4db4-b0fd-160e8dff20dd'::uuid,
  '60672aa2-a431-4b1c-98ad-4be92c073f40'::uuid,
  '2024-10-03',
  '2025-09-16 15:26:20.853',
  '2025-09-16 15:26:20.853',
  'cc5d3c53-7eea-4019-b968-a36f756f4cc0'::uuid
WHERE EXISTS (
  SELECT 1 FROM crm_v2.invoice_accounts ia WHERE ia.invoice_account_id = '762fe57e-61c9-4db4-b0fd-160e8dff20dd'
);

COMMIT;

-- Delete those invoice accounts missing invoice_account_addresses records and not linked to a charge version. Because
-- they are not linked to a charge version they can't have been billed and there is no reason to try and fix them.
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
        AND table_name = 'charge_versions'
    )
  THEN
    DELETE FROM crm_v2.invoice_accounts ia
    WHERE
      NOT EXISTS (
        SELECT 1 FROM crm_v2.invoice_account_addresses iaa WHERE iaa.invoice_account_id = ia.invoice_account_id
      )
      AND NOT EXISTS (
        SELECT 1 FROM water.charge_versions cv WHERE cv.invoice_account_id = ia.invoice_account_id
      );
  END IF;
END
$$;
