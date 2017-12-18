



ALTER TABLE "crm"."entity"
DROP CONSTRAINT IF EXISTS "unique_nm_type";
ALTER TABLE "crm"."entity" ADD CONSTRAINT "unique_nm_type" UNIQUE ("entity_nm", "entity_type");

ALTER TABLE "crm"."entity_roles"
DROP CONSTRAINT IF EXISTS "unique_role";
ALTER TABLE "crm"."entity_roles"
  ADD CONSTRAINT "unique_role" UNIQUE ("entity_id", "regime_entity_id", "company_entity_id");

-- create companioes for initial licences
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','company') on conflict (entity_nm,entity_type) DO NOTHING;

-- create crm entities for private beta 1 users
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;

-- create crm entities for private beta 2 internal users
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'c***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'***REMOVED***','individual') on conflict (entity_nm,entity_type) DO NOTHING;


-- SET UP A john

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';

-- Wendy
delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';

-- Geoff
delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'agent', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'agent', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';


-- create admin roles for env agency users
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict (entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';


insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'c***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';


-- delete roles for users from private beta and reload and set company_id for documents
delete from crm.entity_roles where entity_id in (

select entity_id from crm.entity where entity_nm='***REMOVED***'
) and entity_role_id is not null;

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =

'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=

'***REMOVED***';



update crm.document_header set company_entity_id=(


select entity_id from crm.entity where entity_nm='***REMOVED***'

) where system_external_id in (

'***REMOVED***'

);


delete from crm.entity_roles where entity_id in (

select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =

'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=

'***REMOVED***';




update crm.document_header set company_entity_id=(


select entity_id from crm.entity where entity_nm='***REMOVED***'

) where system_external_id in (

'***REMOVED***

);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
)
;
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';

update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***'
);


delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='***REMOVED***'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'***REMOVED***' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'***REMOVED***';

update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='***REMOVED***'
) where system_external_id in (
'***REMOVED***','***REMOVED***','WA/055/0018/009' ,'***REMOVED***','***REMOVED***','***REMOVED***'
);
