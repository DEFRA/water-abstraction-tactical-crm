-----------------------------------
-- remove the foreign keys to start
-----------------------------------
do
$$
declare r record;
begin
  for r in

  select n.nspname as schema_name,
    t.relname as table_name,
    c.conname as constraint_name
  from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
  where t.relname in (
      'company_addresses',
      'company_contacts',
      'document_roles',
      'invoice_account_addresses',
      'invoice_accounts',
      'phone_numbers'
    )
    and n.nspname = 'crm_v2'
    and c.contype = 'f'

  loop
    execute 'alter table crm_v2.' || quote_ident(r.table_name)|| ' drop constraint '|| quote_ident(r.constraint_name) || ';';
  end loop;
end
$$;

---------------------------
-- update the types to uuid
---------------------------
alter table if exists crm_v2.addresses
  alter column address_id set data type uuid using address_id::uuid;

alter table if exists crm_v2.companies
  alter column company_id set data type uuid using company_id::uuid;

alter table if exists crm_v2.company_addresses
  alter column company_address_id set data type uuid using company_address_id::uuid,
  alter column company_id set data type uuid using company_id::uuid,
  alter column address_id set data type uuid using address_id::uuid,
  alter column role_id set data type uuid using role_id::uuid;

alter table if exists crm_v2.company_contacts
  alter column company_contact_id set data type uuid using company_contact_id::uuid,
  alter column company_id set data type uuid using company_id::uuid,
  alter column contact_id set data type uuid using contact_id::uuid,
  alter column role_id set data type uuid using role_id::uuid;

alter table if exists crm_v2.contacts
  alter column contact_id set data type uuid using contact_id::uuid;

alter table if exists crm_v2.document_roles
  alter column document_role_id set data type uuid using document_role_id::uuid,
  alter column document_id set data type uuid using document_id::uuid,
  alter column company_id set data type uuid using company_id::uuid,
  alter column contact_id set data type uuid using contact_id::uuid,
  alter column address_id set data type uuid using address_id::uuid,
  alter column invoice_account_id set data type uuid using invoice_account_id::uuid,
  alter column role_id set data type uuid using role_id::uuid;

alter table if exists crm_v2.documents
  alter column document_id set data type uuid using document_id::uuid;

alter table if exists crm_v2.invoice_account_addresses
  alter column invoice_account_address_id set data type uuid using invoice_account_address_id::uuid,
  alter column invoice_account_id set data type uuid using invoice_account_id::uuid,
  alter column address_id set data type uuid using address_id::uuid;

alter table if exists crm_v2.invoice_accounts
  alter column invoice_account_id set data type uuid using invoice_account_id::uuid,
  alter column company_id set data type uuid using company_id::uuid;

alter table if exists crm_v2.phone_numbers
  alter column phone_number_id set data type uuid using phone_number_id::uuid,
  alter column contact_id set data type uuid using contact_id::uuid;

alter table if exists crm_v2.roles
  alter column role_id set data type uuid using role_id::uuid;

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
