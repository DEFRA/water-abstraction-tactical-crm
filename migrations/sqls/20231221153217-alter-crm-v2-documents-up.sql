/* See https://eaflood.atlassian.net/browse/WATER-4292 */

ALTER TABLE crm_v2.documents ALTER COLUMN regime SET DEFAULT 'water';

ALTER TABLE crm_v2.documents ALTER COLUMN document_type SET DEFAULT 'abstraction_licence';
