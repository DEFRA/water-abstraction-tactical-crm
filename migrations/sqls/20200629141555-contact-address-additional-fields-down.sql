/* alter address table */
alter table crm_v2.addresses
  drop column data_source,
  drop column uprn;

/* alter contacts table */
alter table crm_v2.contacts
  drop column data_source,
  drop column contact_type,
  drop column suffix,
  drop column department;

alter table crm_v2.contacts 
  rename column middle_initials to middle_names;

/* drop enum types */
drop type crm_v2.data_source;
drop type crm_v2.contact_type;
