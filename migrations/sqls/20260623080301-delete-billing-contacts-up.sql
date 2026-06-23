/*
  https://eaflood.atlassian.net/browse/WATER-5691

  When we migrated licence holder contacts management from the legacy service (see
  [WATER-5456](https://eaflood.atlassian.net/browse/WATER-5456)), as usual, we added our sparkles!

  This included checking if a contact with the same name and email was already assigned to the licence holder. The
  legacy version made no such checks, leading to a number of duplicates in some licence holders.

  A user has tried to add a contact to a licence holder, but is seeing the “A contact with this name and email already
  exists“ message, even though it's not listed in the licence holder contacts.

  They think it is because the service doesn't allow duplicate contacts at all, so we've been asked to amend the logic
  to check only within the current licence holder.

  But we already do.

  What the user or anyone else cannot see is that there is an existing licence holder contact with the same name and
  email. This is because it is a redundant contact we no longer use.

  Before the service handled charging, NALD maintained 'billing' contacts against licence holders. These were imported
  into WRLS as part of the nightly import. When WRLS took over charging and billing accounts were introduced, the import
  was amended to stop importing them.

  But they still exist, and the query used in the duplicate check is not filtering by role, only licence holder
  (`company_id`).

  This data migration deletes these records. It will also check for any orphaned `crm_v2.contacts` records and delete
  those as well.
 */

BEGIN;

WITH billing_contacts AS (
  SELECT
    cc.company_contact_id
  FROM
    crm_v2.company_contacts cc
  INNER JOIN
    crm_v2.roles r
    ON r.role_id = cc.role_id
  WHERE
    r."name" = 'billing'
)
DELETE FROM
  crm_v2.company_contacts cc
WHERE
  cc.company_contact_id IN (SELECT company_contact_id FROM billing_contacts);

WITH orphaned_contacts AS (
  SELECT
    c.contact_id
  FROM
    crm_v2.contacts c
  WHERE
    NOT EXISTS (
      SELECT
        1
      FROM
        crm_v2.company_contacts cc
      WHERE
        cc.contact_id = c.contact_id
    )
    AND NOT EXISTS (
      SELECT
        1
      FROM
        crm_v2.document_roles dr
      WHERE
        dr.contact_id = c.contact_id
    )
    AND NOT EXISTS (
      SELECT
        1
      FROM
        crm_v2.invoice_account_addresses iaa
        WHERE
          iaa.contact_id = c.contact_id
    )
)
DELETE FROM
  crm_v2.contacts c
WHERE
  c.contact_id IN (SELECT contact_id FROM orphaned_contacts);

COMMIT;
