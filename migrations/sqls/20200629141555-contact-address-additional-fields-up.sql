/* create enum types */
create type crm_v2.data_source as enum ('nald', 'wrls');
create type crm_v2.contact_type as enum ('person', 'department');


/* alter address table */
alter table crm_v2.addresses
  add column data_source crm_v2.data_source,
  add column uprn bigint;

update crm_v2.addresses set data_source='nald';
alter table crm_v2.addresses 
  alter column data_source set not null;

/* alter contacts table */
alter table crm_v2.contacts
  add column data_source crm_v2.data_source,
  add column contact_type crm_v2.contact_type,
  add column suffix varchar,
  add column department varchar;

alter table crm_v2.contacts
  rename column middle_names to middle_initials;

update crm_v2.contacts set data_source='nald';
alter table crm_v2.contacts 
  alter column data_source set not null;