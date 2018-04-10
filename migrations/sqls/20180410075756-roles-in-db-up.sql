CREATE TABLE "crm"."roles" (
  "role_id" varchar NOT NULL,
  "role_nm" varchar,
  "role_descr" varchar,
  PRIMARY KEY ("role_id")
)
;

insert into "crm"."roles" ("role_id","role_nm") values ('admin','admin');
insert into "crm"."roles" ("role_id","role_nm") values ('primary_user','primary_user');
insert into "crm"."roles" ("role_id","role_nm") values ('user','user');
insert into "crm"."roles" ("role_id","role_nm") values ('agent','agent');
insert into "crm"."roles" ("role_id","role_nm") values ('ar_admin','ar_admin');
insert into "crm"."roles" ("role_id","role_nm") values ('ar_approver','ar_approver');
insert into "crm"."roles" ("role_id","role_nm") values ('ar_user','ar_user');
