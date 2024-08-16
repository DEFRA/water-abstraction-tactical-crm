/*
  Data fix for wrongly deleted document headers

  https://eaflood.atlassian.net/browse/WATER-4627

  We received a report that an external user was unable to link MD/054/0009/047 to their account (it returned the error
  "We cannot find these licence numbers"). We reproduced the issue in pre-prod and tracked down the cause.

  We tracked the cause down to the document header having its `date_deleted` field populated when it shouldn't have
  been. We were able to identify 4 other licences (document headers) that also shouldn't have had their `date_deleted`
  fields populated.

  This data fix sets the field back to NULL.
*/

UPDATE crm.document_header SET date_deleted = null WHERE system_external_id IN ('MD/054/0009/047', 'MD/054/0009/055', 'MD/054/0009/049', '03/28/22/0033', 'TH/039/0030/058');
