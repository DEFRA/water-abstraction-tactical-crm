/*
  https://eaflood.atlassian.net/browse/WATER-5038

  We've updated the overnight import from NALD to include a clean-up step.

  Now, records that exist in WRLS but don't exist in NALD will be deleted. That is, unless they are linked to something.

  The following seven licences have been registered to user accounts but have since been deleted from NALD.

  - 03/28/81/0045/1/RO1
  - 6/33/48/\*S/0234/L
  - 7/34/06/\*G/0279A/L
  - AN/034/0006/017/L
  - AN/034/0006/024/L
  - AN/034/0009/004/L
  - TH/039/0022/029/L

  You should be able to unlink them through the UI, but that does not seem to be working in this case, likely due to the
  legacy code not being compatible with the deletion of unrelated records.

  If the unlink was working, all it does is set `company_entity_id` to null in the `crm.document_header` table for the
  matching licence record. That is also all we need to do to allow the 'clean' process in
  [water-abstraction-import](https://github.com/DEFRA/water-abstraction-system) to finally remove the remains of the
  licence records.
 */

UPDATE crm.document_header SET
  company_entity_id = NULL
WHERE
  system_external_id IN (
    '03/28/81/0045/1/RO1',
    '6/33/48/*S/0234/L',
    '7/34/06/*G/0279A/L',
    'AN/034/0006/017/L',
    'AN/034/0006/024/L',
    'AN/034/0009/004/L',
    'TH/039/0022/029/L'
  );
