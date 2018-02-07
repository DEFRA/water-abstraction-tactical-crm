/* Replace with your SQL commands */
CREATE TABLE crm.verification
(
    verification_id character varying COLLATE pg_catalog."default" NOT NULL,
    entity_id character varying COLLATE pg_catalog."default" NOT NULL,
    company_entity_id character varying COLLATE pg_catalog."default" NOT NULL,
    verification_code character varying COLLATE pg_catalog."default" NOT NULL,
    date_verified timestamp with time zone,
    date_created timestamp with time zone NOT NULL,
    method character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT verification_pkey PRIMARY KEY (verification_id)
);
