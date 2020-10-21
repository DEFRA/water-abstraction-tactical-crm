alter table crm.document_header
  drop column date_created,
  drop column date_updated,
  drop column date_deleted;

alter table crm_v2.documents
  drop column date_deleted;
