create index idx_document_header_company_id on crm.document_header(company_entity_id);

create index entity_roles_idx_entity_id on crm.entity_roles(entity_id);
create index entity_roles_idx_company_id on crm.entity_roles(company_entity_id);

create index verification_idx_entity_id on crm.verification(entity_id);
create index verification_documents_idx_document_id on crm.verification_documents(document_id);
