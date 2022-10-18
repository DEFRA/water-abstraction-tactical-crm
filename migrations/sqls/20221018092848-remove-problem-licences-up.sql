/* This query is deleting bad data that was transfered over from NALD. Due to
the database being relational and therefore the tables being joined multiple
record id's had to be searched and deleted*/

DELETE FROM crm.document_header WHERE system_external_id
IN ('`MD/054/0021/030', '03/28/27/0005 S/G');
