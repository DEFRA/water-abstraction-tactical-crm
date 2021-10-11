alter table crm_v2.roles add column label VARCHAR default null;

UPDATE crm_v2.roles SET label='Returns' where name = 'returnsTo';
UPDATE crm_v2.roles SET label='Licence Holder' where name = 'licenceHolder';
UPDATE crm_v2.roles SET label='Billing' where name = 'billing';
