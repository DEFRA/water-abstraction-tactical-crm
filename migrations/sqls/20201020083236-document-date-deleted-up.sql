alter table crm.document_header
  add column date_created timestamp without time zone not null default now(),
  add column date_updated timestamp without time zone not null default now(),
  add column date_deleted timestamp without time zone;

alter table crm_v2.documents
  add column date_deleted timestamp without time zone;
