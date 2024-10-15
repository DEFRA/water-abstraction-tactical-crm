BEGIN;

-- Drop unique index on the licence number
DROP INDEX crm_v2.documents_only_one_document_ref;

-- Create unique index on licence number
CREATE UNIQUE INDEX documents_document_ref ON crm_v2.documents(regime, document_type, document_ref);

COMMIT;
