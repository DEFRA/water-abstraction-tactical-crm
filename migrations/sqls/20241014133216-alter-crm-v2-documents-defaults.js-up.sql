BEGIN;

-- Drop unique index on licence number, document type and regime
DROP INDEX crm_v2.documents_document_ref;

-- -- Create unique index on licence number
CREATE UNIQUE INDEX documents_only_one_document_ref ON crm_v2.documents(document_ref);

COMMIT;
