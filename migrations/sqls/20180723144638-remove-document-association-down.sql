create table "document_association" (
  "document_association_id" varchar COLLATE "pg_catalog"."default" not null,
  "document_id" varchar COLLATE "pg_catalog"."default",
  "entity_id" varchar COLLATE "pg_catalog"."default"
);

alter table "document_association" add constraint "document_association_pkey" primary key ("document_association_id");
