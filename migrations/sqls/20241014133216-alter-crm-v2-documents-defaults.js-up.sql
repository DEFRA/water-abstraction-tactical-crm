-- Drop unique index on licence number, document type and regime
drop index crm_v2.documents_document_ref;

-- -- Create unique index on licence number
create unique index documents_only_one_document_ref on crm_v2.documents(document_ref);
