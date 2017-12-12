/* Replace with your SQL commands */
ALTER TABLE crm.document_header
  ADD COLUMN verified integer,
  ADD COLUMN verification_id character varying COLLATE pg_catalog."default",
  ADD CONSTRAINT verification_id FOREIGN KEY (verification_id)
      REFERENCES crm.verification (verification_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION;
