create table "entity_association" (
  "entity_association_id" varchar collate "pg_catalog"."default" not null,
  "entity_up_type" varchar collate "pg_catalog"."default" not null,
  "entity_up_id" varchar collate "pg_catalog"."default" not null,
  "entity_down_type" varchar collate "pg_catalog"."default" not null,
  "entity_down_id" varchar collate "pg_catalog"."default" not null,
  "access_type" varchar collate "pg_catalog"."default",
  "inheritable" varchar collate "pg_catalog"."default"
);

alter table "entity_association" add constraint "entity_association_pkey" primary key ("entity_association_id", "entity_up_type", "entity_up_id", "entity_down_type", "entity_down_id");
