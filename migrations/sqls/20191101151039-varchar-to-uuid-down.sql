-----------------------------------
-- remove the foreign keys to start
-----------------------------------
alter table if exists crm_v2.company_addresses
  drop constraint company_addresses_company_id_fkey,
  drop constraint company_addresses_address_id_fkey,
  drop constraint company_addresses_role_id_fkey;

alter table if exists crm_v2.company_contacts
  drop constraint company_contacts_company_id_fkey,
  drop constraint company_contacts_contact_id_fkey,
  drop constraint company_contacts_role_id_fkey;

alter table if exists crm_v2.document_roles
  drop constraint document_roles_document_id_fkey,
  drop constraint document_roles_company_id_fkey,
  drop constraint document_roles_contact_id_fkey,
  drop constraint document_roles_address_id_fkey,
  drop constraint document_roles_role_id_fkey,
  drop constraint document_roles_invoice_account_id_fkey;

alter table if exists crm_v2.invoice_account_addresses
  drop constraint invoice_account_addresses_invoice_account_id_fkey,
  drop constraint invoice_account_addresses_address_id_fkey;

alter table if exists crm_v2.invoice_accounts
  drop constraint invoice_accounts_company_id_fkey;

alter table if exists crm_v2.phone_numbers
  drop constraint phone_numbers_contact_id_fkey;


---------------------------
-- update the types to varchar
---------------------------
alter table if exists crm_v2.addresses
  alter column address_id set data type varchar using address_id::varchar;

alter table if exists crm_v2.companies
  alter column company_id set data type varchar using company_id::varchar;

alter table if exists crm_v2.company_addresses
  alter column company_address_id set data type varchar using company_address_id::varchar,
  alter column company_id set data type varchar using company_id::varchar,
  alter column address_id set data type varchar using address_id::varchar,
  alter column role_id set data type varchar using role_id::varchar;

alter table if exists crm_v2.company_contacts
  alter column company_contact_id set data type varchar using company_contact_id::varchar,
  alter column company_id set data type varchar using company_id::varchar,
  alter column contact_id set data type varchar using contact_id::varchar,
  alter column role_id set data type varchar using role_id::varchar;

alter table if exists crm_v2.contacts
  alter column contact_id set data type varchar using contact_id::varchar;

alter table if exists crm_v2.document_roles
  alter column document_role_id set data type varchar using document_role_id::varchar,
  alter column document_id set data type varchar using document_id::varchar,
  alter column company_id set data type varchar using company_id::varchar,
  alter column contact_id set data type varchar using contact_id::varchar,
  alter column address_id set data type varchar using address_id::varchar,
  alter column invoice_account_id set data type varchar using invoice_account_id::varchar,
  alter column role_id set data type varchar using role_id::varchar;

alter table if exists crm_v2.documents
  alter column document_id set data type varchar using document_id::varchar;

alter table if exists crm_v2.invoice_account_addresses
  alter column invoice_account_address_id set data type varchar using invoice_account_address_id::varchar,
  alter column invoice_account_id set data type varchar using invoice_account_id::varchar,
  alter column address_id set data type varchar using address_id::varchar;

alter table if exists crm_v2.invoice_accounts
  alter column invoice_account_id set data type varchar using invoice_account_id::varchar,
  alter column company_id set data type varchar using company_id::varchar;

alter table if exists crm_v2.phone_numbers
  alter column phone_number_id set data type varchar using phone_number_id::varchar,
  alter column contact_id set data type varchar using contact_id::varchar;

alter table if exists crm_v2.roles
  alter column role_id set data type varchar using role_id::varchar;

------------------------------------------
-- reinstate the foreign key relationships
------------------------------------------
alter table if exists crm_v2.company_addresses
  add constraint company_addresses_company_id_fkey
    foreign key (company_id) references crm_v2.companies (company_id),
  add constraint company_addresses_address_id_fkey
    foreign key (address_id) references crm_v2.addresses (address_id),
  add constraint company_addresses_role_id_fkey
    foreign key (role_id) references crm_v2.roles (role_id);


alter table if exists crm_v2.company_contacts
  add constraint company_contacts_company_id_fkey
    foreign key (company_id) references crm_v2.companies (company_id),
  add constraint company_contacts_contact_id_fkey
    foreign key (contact_id) references crm_v2.contacts (contact_id),
  add constraint company_contacts_role_id_fkey
    foreign key (role_id) references crm_v2.roles (role_id);


alter table if exists crm_v2.document_roles
  add constraint document_roles_document_id_fkey
    foreign key (document_id) references crm_v2.documents (document_id),
  add constraint document_roles_company_id_fkey
    foreign key (company_id) references crm_v2.companies (company_id),
  add constraint document_roles_contact_id_fkey
    foreign key (contact_id) references crm_v2.contacts (contact_id),
  add constraint document_roles_address_id_fkey
    foreign key (address_id) references crm_v2.addresses (address_id),
  add constraint document_roles_role_id_fkey
    foreign key (role_id) references crm_v2.roles (role_id),
  add constraint document_roles_invoice_account_id_fkey
    foreign key (invoice_account_id) references crm_v2.invoice_accounts (invoice_account_id);


alter table if exists crm_v2.invoice_account_addresses
  add constraint invoice_account_addresses_invoice_account_id_fkey
    foreign key (invoice_account_id) references crm_v2.invoice_accounts (invoice_account_id),
  add constraint invoice_account_addresses_address_id_fkey
    foreign key (address_id) references crm_v2.addresses (address_id);


alter table if exists crm_v2.invoice_accounts
  add constraint invoice_accounts_company_id_fkey
    foreign key (company_id) references crm_v2.companies (company_id);


alter table if exists crm_v2.phone_numbers
  add constraint phone_numbers_contact_id_fkey
    foreign key (contact_id)
    references crm_v2.contacts (contact_id);
