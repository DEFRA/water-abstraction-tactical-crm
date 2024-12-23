/*
  https://eaflood.atlassian.net/browse/WATER-4833

  > Same issue as [PR 1052](https://github.com/DEFRA/water-abstraction-tactical-crm/pull/1052)

  Users reported an issue with licence holder information.

  - Two licence holders were listed on the view licence contact details page (there should only be one)
  - When adding a new charge version, the journey was suggesting to create the new billing account using the old company
    details

  We found the issue was that for this licence, we have two entries in `crm_v2.document_roles` with the role of
  `licenceHolder` and no end dates. In the case of the licence holder, the service derives the 'current' licence holder
  by selecting the one with no end date (there should only be one).

  Because we have 2 with no end date, view contact details shows both. In the legacy charge version journey, it gets all
  licence roles for the licence, filters out any that are not 'licenceHolder', and then selects the first that meets
  this criteria.

  - Start date is before or the same as the chosen date for the new charge version
  - End date is null or after the chosen date for the new charge version

  Again, the old licence holder is the first record to meet these criteria; hence, the legacy code chooses it as the
  'relevant company' to display.

  In this example, we cannot ascertain what the cause of the data getting into this state was. Unlike WATER-4696 the
  licence versions are in sync. But the fix is the same; delete the erroneous `crm_v2.document_roles` record.
 */

DELETE FROM crm_v2.document_roles
WHERE
  document_id = (
    SELECT d.document_id FROM crm_v2.documents d WHERE d.document_ref = '6/33/12/*S/0022'
  )
  AND start_date = '2024-03-31'
  AND end_date IS NULL;
