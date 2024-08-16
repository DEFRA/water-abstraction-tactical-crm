/* Revert the records to their previous state */

BEGIN;

UPDATE crm.document_header SET date_deleted = '2023-10-03 01:05:17.744' WHERE system_external_id = 'MD/054/0009/047';
UPDATE crm.document_header SET date_deleted = '2023-10-03 01:05:17.744' WHERE system_external_id = 'MD/054/0009/055';
UPDATE crm.document_header SET date_deleted = '2023-08-30 01:05:07.489' WHERE system_external_id = 'MD/054/0009/049';
UPDATE crm.document_header SET date_deleted = '2021-09-02 01:05:01.482' WHERE system_external_id = '03/28/22/0033';
UPDATE crm.document_header SET date_deleted = '2023-10-10 01:04:59.864' WHERE system_external_id = 'TH/039/0030/058';

COMMIT;
