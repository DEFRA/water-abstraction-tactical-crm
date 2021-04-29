/* Drop hash columns for the crm_v2.addresses entity */
alter table crm_v2.addresses drop column last_hash;
alter table crm_v2.addresses drop column current_hash;

/* Drop hash columns for the crm_v2.companies entity */
alter table crm_v2.companies drop column last_hash;
alter table crm_v2.companies drop column current_hash;

/* Drop hash columns for the crm_v2.contacts entity */
alter table crm_v2.contacts drop column last_hash;
alter table crm_v2.contacts drop column current_hash;

