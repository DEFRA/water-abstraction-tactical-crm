/* Replace with your SQL commands */

/* Add source to entity table - this enables us to identify contacts imported
   from other teams rather than input directly via VmL */
 ALTER TABLE "crm"."entity"
   ADD COLUMN source varchar COLLATE "pg_catalog"."default";

 -- ----------------------------
 -- Table structure for document_entity
 -- ----------------------------
 DROP TABLE IF EXISTS "crm"."document_entity";
 CREATE TABLE "crm"."document_entity" (
   "document_entity_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
   "entity_id" varchar COLLATE "pg_catalog"."default",
   "role" varchar COLLATE "pg_catalog"."default",
   "document_id" varchar COLLATE "pg_catalog"."default",
   "created_at" timestamp with time zone NOT NULL,
   "modified_at" timestamp with time zone
 );

 -- ----------------------------
 -- Uniques structure for table document_entity
 -- ----------------------------
 ALTER TABLE "crm"."document_entity" ADD CONSTRAINT "unique_document_entity_role" UNIQUE ("entity_id", "document_id", "role");

 -- ----------------------------
 -- Primary Key structure for table entity_roles
 -- ----------------------------
 ALTER TABLE "crm"."document_entity" ADD CONSTRAINT "document_entity_pkey" PRIMARY KEY ("document_entity_id");
