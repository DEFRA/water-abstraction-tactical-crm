/* Create hash columns for the crm_v2.addresses entity */
alter table crm_v2.addresses add column last_hash VARCHAR default null;
alter table crm_v2.addresses add column current_hash VARCHAR default null;

/* Populate initial addresses hash values */
update crm_v2.addresses addresses set last_hash = md5(CAST((addresses.address_1, addresses.address_2, addresses.address_3, addresses.address_4, addresses.town, addresses.county, addresses.postcode) AS text));
update crm_v2.addresses addresses set current_hash = md5(CAST((addresses.address_1, addresses.address_2, addresses.address_3, addresses.address_4, addresses.town, addresses.county, addresses.postcode) AS text));


/* Create hash columns for the crm_v2.companies entity */
alter table crm_v2.companies add column last_hash VARCHAR default null;
alter table crm_v2.companies add column current_hash VARCHAR default null;

/* Populate initial companies hash values */
update crm_v2.companies companies set last_hash = md5(CAST((companies.name, companies.type) AS text));
update crm_v2.companies companies set current_hash = md5(CAST((companies.name, companies.type) AS text));


/* Create hash columns for the crm_v2.contacts entity */
alter table crm_v2.contacts add column last_hash VARCHAR default null;
alter table crm_v2.contacts add column current_hash VARCHAR default null;

/* Populate initial contacts hash values */
update crm_v2.contacts contacts set last_hash = md5(CAST((contacts.salutation, contacts.first_name, contacts.last_name, contacts.department, contacts.suffix) AS text));
update crm_v2.contacts contacts set current_hash = md5(CAST((contacts.salutation, contacts.first_name, contacts.last_name, contacts.department, contacts.suffix) AS text));
