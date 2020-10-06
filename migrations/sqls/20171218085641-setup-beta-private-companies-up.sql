ALTER TABLE "crm"."entity"
DROP CONSTRAINT IF EXISTS "unique_nm_type";
ALTER TABLE "crm"."entity" ADD CONSTRAINT "unique_nm_type" UNIQUE ("entity_nm", "entity_type");

ALTER TABLE "crm"."entity_roles"
DROP CONSTRAINT IF EXISTS "unique_role";
ALTER TABLE "crm"."entity_roles"
  ADD CONSTRAINT "unique_role" UNIQUE ("entity_id", "regime_entity_id", "company_entity_id");

-- create water-abstraction regime
insert into crm.entity (entity_id,entity_nm,entity_type)
values (uuid_in(md5(random()::text || now()::text)::cstring),'water-abstraction','regime') on conflict (entity_nm,entity_type) DO NOTHING;

-- create companies for initial licences
insert into crm.entity (entity_id,entity_nm,entity_type)
values (uuid_in(md5(random()::text || now()::text)::cstring),'company-1','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (entity_id,entity_nm,entity_type)
values (uuid_in(md5(random()::text || now()::text)::cstring),'company-2','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (entity_id,entity_nm,entity_type)
values (uuid_in(md5(random()::text || now()::text)::cstring),'company-3','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (entity_id,entity_nm,entity_type)
values (uuid_in(md5(random()::text || now()::text)::cstring),'company-4','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (entity_id,entity_nm,entity_type)
values (uuid_in(md5(random()::text || now()::text)::cstring),'company-5','company') on conflict (entity_nm,entity_type) DO NOTHING;

-- create admin roles for env agency users
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1
from entity i
  join entity r on r.entity_nm = 'water-abstraction'
where i.entity_nm= 'test-ea-1-user@example.com' on conflict (entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1
from entity i
  join entity r on r.entity_nm = 'water-abstraction'
  where i.entity_nm= 'test-ea-2-user@example.com' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';


-- delete roles for users from private beta and reload and set company_id for documents
delete from crm.entity_roles where entity_id in (
  select entity_id
  from crm.entity
  where entity_nm='company-1@example.com'
) and entity_role_id is not null;

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1
from entity i
  join entity c on c.entity_nm = 'company-1'
  join entity r on r.entity_nm = 'water-abstraction'
where i.entity_nm='company-1@example.com';

update crm.document_header
set company_entity_id=(
  select entity_id
  from crm.entity
  where entity_nm='company-1'
)
where system_external_id in ('licence-id-1');

delete from crm.entity_roles where entity_id in (
  select entity_id
  from crm.entity
  where entity_nm='company-2@example.com'
);

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1
from entity i
  join entity c on c.entity_nm = 'company-2'
  join entity r on r.entity_nm = 'water-abstraction'
where i.entity_nm='company-2@example.com';

update crm.document_header set company_entity_id=(
  select entity_id
  from crm.entity
  where entity_nm='company-2'
)
where system_external_id in ('licence-id-2');

delete from crm.entity_roles
where entity_id in (
  select entity_id
  from crm.entity
  where entity_nm='company-3@example.com'
);

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1
from entity i
  join entity c on c.entity_nm = 'company-3'
  join entity r on r.entity_nm = 'water-abstraction'
where i.entity_nm='company-3@example.com';

update crm.document_header set company_entity_id=(
  select entity_id
  from crm.entity
  where entity_nm='company-3'
)
where system_external_id in ('licence-id-3');

delete from crm.entity_roles
where entity_id in (
  select entity_id
  from crm.entity
  where entity_nm='company-4@example.com'
);

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1
from entity i
  join entity c on c.entity_nm = 'company-4'
  join entity r on r.entity_nm = 'water-abstraction' 
where i.entity_nm='company-4@example.com';

update crm.document_header set company_entity_id=(
  select entity_id
  from crm.entity
  where entity_nm='company-4'
)
where system_external_id in ('licence-id-4');

delete from crm.entity_roles where entity_id in (
  select entity_id
  from crm.entity
  where entity_nm='company-5@example.com'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1
from entity i
  join entity c on c.entity_nm = 'company-5'
  join entity r on r.entity_nm = 'water-abstraction'
where i.entity_nm='company-5@example.com';

