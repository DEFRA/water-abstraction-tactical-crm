-- Drop unique index on the licence number
drop index crm_v2.documents_only_one_document_ref;

-- Create unique index on licence number
create unique index documents_document_ref on crm_v2.documents(regime, document_type, document_ref);
