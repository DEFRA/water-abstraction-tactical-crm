CREATE SCHEMA IF NOT EXISTS crm_v2;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "crm_v2"."roles" (
  "role_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("role_id")
);

CREATE TABLE IF NOT EXISTS "crm_v2"."companies" (
  "company_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL,
  "type" varchar NOT NULL,
  "company_number" varchar,
  "ias_account_number" varchar,
  "external_id" varchar,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("company_id"),
  CONSTRAINT company_number UNIQUE (company_number),
  CONSTRAINT ias_account_number UNIQUE (ias_account_number)
);

CREATE TABLE IF NOT EXISTS "crm_v2"."contacts" (
  "contact_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "salutation" varchar,
  "first_name" varchar,
  "middle_names" varchar,
  "last_name" varchar,
  "external_id" varchar,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("contact_id")
);

CREATE TABLE IF NOT EXISTS "crm_v2"."company_contacts" (
  "company_contact_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "company_id" varchar NOT NULL,
  "contact_id" varchar NOT NULL,
  "role_id" varchar NOT NULL,
  "is_default" boolean NOT NULL DEFAULT false,
  "email_address" varchar,
  "start_date" date NOT NULL,
  "end_date" date,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("company_contact_id"),
  CONSTRAINT company_role_contact UNIQUE (company_id, contact_id, role_id),
  FOREIGN KEY (company_id) REFERENCES crm_v2.companies (company_id),
  FOREIGN KEY (contact_id) REFERENCES crm_v2.contacts (contact_id),
  FOREIGN KEY (role_id) REFERENCES crm_v2.roles (role_id)
);

CREATE TABLE IF NOT EXISTS "crm_v2"."addresses" (
  "address_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "address_1" varchar NOT NULL,
  "address_2" varchar,
  "address_3" varchar,
  "address_4" varchar,
  "town" varchar NOT NULL,
  "county" varchar NOT NULL,
  "postcode" varchar NOT NULL,
  "country" varchar(2) NOT NULL,
  "external_id" varchar,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("address_id")
);

CREATE TABLE IF NOT EXISTS "crm_v2"."company_addresses" (
  "company_address_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "company_id" varchar NOT NULL,
  "address_id" varchar NOT NULL,
  "role_id" varchar NOT NULL,
  "is_default" boolean NOT NULL DEFAULT false,
  "start_date" date NOT NULL,
  "end_date" date,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("company_address_id"),
  CONSTRAINT company_role_address UNIQUE (company_id, address_id, role_id),
  FOREIGN KEY (company_id) REFERENCES crm_v2.companies (company_id),
  FOREIGN KEY (address_id) REFERENCES crm_v2.addresses (address_id),
  FOREIGN KEY (role_id) REFERENCES crm_v2.roles (role_id)
);

CREATE TABLE IF NOT EXISTS "crm_v2"."phone_numbers" (
  "phone_number_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "contact_id" varchar NOT NULL,
  "type" varchar,
  "phone_number" varchar,
  "start_date" date NOT NULL,
  "end_date" date,
  "external_id" varchar,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("phone_number_id"),
  FOREIGN KEY (contact_id) REFERENCES crm_v2.contacts (contact_id)
);

CREATE TYPE "crm_v2"."document_status" AS ENUM ('current', 'draft', 'superseded');

CREATE TABLE IF NOT EXISTS "crm_v2"."documents" (
  "document_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "regime" varchar NOT NULL,
  "document_type" varchar NOT NULL,
  "version_number" integer NOT NULL,
  "document_ref" varchar NOT NULL,
  "status" "crm_v2"."document_status" NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date,
  "external_id" varchar,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("document_id"),
  CONSTRAINT regime_document UNIQUE (regime, document_type, version_number, document_ref)
);

CREATE TABLE IF NOT EXISTS "crm_v2"."document_roles" (
  "document_role_id" varchar NOT NULL DEFAULT gen_random_uuid(),
  "document_id" varchar NOT NULL,
  "company_id" varchar NOT NULL,
  "contact_id" varchar,
  "address_id" varchar,
  "role_id" varchar NOT NULL,
  "is_default" boolean NOT NULL DEFAULT false,
  "start_date" date NOT NULL,
  "end_date" date,
  "date_created" timestamp NOT NULL DEFAULT NOW(),
  "date_updated" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("document_role_id"),
  CONSTRAINT document_role_contact UNIQUE (document_id, company_id, contact_id, address_id, role_id),
  FOREIGN KEY (document_id) REFERENCES crm_v2.documents (document_id),
  FOREIGN KEY (company_id) REFERENCES crm_v2.companies (company_id),
  FOREIGN KEY (contact_id) REFERENCES crm_v2.contacts (contact_id),
  FOREIGN KEY (address_id) REFERENCES crm_v2.addresses (address_id),
  FOREIGN KEY (role_id) REFERENCES crm_v2.roles (role_id)
);
