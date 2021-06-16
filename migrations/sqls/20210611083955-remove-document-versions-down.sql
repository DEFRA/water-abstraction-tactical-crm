-- Add removed enum type
create type "crm_v2"."document_status" as enum ('current', 'draft', 'superseded');

-- Add removed columns
alter table crm_v2.documents 
  add column status crm_v2.document_status,
  add column version_number integer;

-- Set a default version number - these will be overwritten by a
-- future import
update crm_v2.documents set version_number=1, status='current';

-- Set not null constraints
alter table crm_v2.documents 
  alter column status set not null,
  alter column version_number set not null;

-- Create unique constraint on licence number within regime
create unique index documents_document_ref on crm_v2.documents(regime, document_type, document_ref);
