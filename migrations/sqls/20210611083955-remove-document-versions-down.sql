-- Drop unique index on licence number
drop index crm_v2.documents_document_ref;

-- Add removed enum type
create type "crm_v2"."document_status" as enum ('current', 'draft', 'superseded');

-- Add back removed columns
alter table crm_v2.documents 
  add column status crm_v2.document_status,
  add column version_number integer;

alter table crm_v2.document_roles 
  add column is_default boolean default false not null;

-- Set a default version number - these will be overwritten by a
-- future import
update crm_v2.documents set version_number=1, status='current';

-- Set not null constraints
alter table crm_v2.documents 
  alter column status set not null,
  alter column version_number set not null;

-- Create unique index on licence number
create unique index regime_document on crm_v2.documents(regime, document_type, document_ref, version_number);
