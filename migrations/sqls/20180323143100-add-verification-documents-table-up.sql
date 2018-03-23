-- Table: crm.verification_documents

-- DROP TABLE crm.verification_documents;

CREATE TABLE crm.verification_documents
(
    verification_id character varying COLLATE pg_catalog."default" NOT NULL,
    document_id character varying COLLATE pg_catalog."default" NOT NULL,

    CONSTRAINT document_id FOREIGN KEY (document_id)
        REFERENCES crm.document_header (document_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT verification_id FOREIGN KEY (verification_id)
        REFERENCES crm.verification (verification_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    PRIMARY KEY(verification_id, document_id)
);

-- Migrate any in-flight verifications to new join table
INSERT INTO crm.verification_documents  (verification_id, document_id)
SELECT verification_id, document_id
  FROM crm.document_header
  WHERE verification_id IS NOT NULL
    AND verified IS NULL
    AND company_entity_id IS NULL
