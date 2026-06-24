/*
  https://eaflood.atlassian.net/browse/WATER-5691

  We recently added a data migration to
  [Delete redundant billing contacts](https://github.com/DEFRA/water-abstraction-tactical-crm/pull/1142).

  In summary, a bug reminded us that we have all this 'billing' CRM data that is no longer used. Rather than code around
  the data, we should be getting rid of it.

  We thought we had covered everything, but then spotted we'd missed `crm_v2.company_addresses`. These too have a
  `role_id` which means they can be assigned to the company as a 'billing address'. But again, we don't use them as they
  were replaced by the `crm_v2.invoice_account_addresses`.

  This data migration deletes these records.
 */

WITH billing_company_addresses AS (
  SELECT
    ca.company_address_id
  FROM
    crm_v2.company_addresses ca
  INNER JOIN
    crm_v2.roles r
    ON
      r.role_id = ca.role_id
  WHERE
    r."name" = 'billing'
)
DELETE FROM
  crm_v2.company_addresses ca
WHERE
  ca.company_address_id IN (SELECT company_address_id FROM billing_company_addresses);
