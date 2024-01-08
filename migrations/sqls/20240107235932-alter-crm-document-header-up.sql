/* See https://eaflood.atlassian.net/browse/WATER-4292 */

ALTER TABLE crm.document_header ALTER COLUMN system_id SET DEFAULT 'permit-repo';
