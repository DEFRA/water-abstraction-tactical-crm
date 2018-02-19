



ALTER TABLE "crm"."entity"
DROP CONSTRAINT IF EXISTS "unique_nm_type";
ALTER TABLE "crm"."entity" ADD CONSTRAINT "unique_nm_type" UNIQUE ("entity_nm", "entity_type");

ALTER TABLE "crm"."entity_roles"
DROP CONSTRAINT IF EXISTS "unique_role";
ALTER TABLE "crm"."entity_roles"
  ADD CONSTRAINT "unique_role" UNIQUE ("entity_id", "regime_entity_id", "company_entity_id");

-- create water-abstraction regime
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'water-abstraction','regime') on conflict (entity_nm,entity_type) DO NOTHING;


-- create companioes for initial licences
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'ASHBOURNE GOLF CLUB LIMITED','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'DAVID AUSTIN ROSES LTD','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'ASTON MANOR BREWERY CO LTD','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'Tarmac Building Products Limited','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'FURNACE MILL FISHERIES','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'F HAINES AND SONS','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'Bransford Lodge Limited','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'Fillongley Spring Water Limited','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'AI & S CROW','company') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'E C DRUMMOND AND SON','company') on conflict (entity_nm,entity_type) DO NOTHING;

-- create crm entities for private beta 1 users
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'rnwalker74@gmail.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'robert@davidaustinroses.co.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'eric@ecdrummond.co.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'Jamie.Weall@astonmanor.co.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'deepa.valand@tarmac.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'edward@furnacemill.net','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'f.hainesandsons@btconnect.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'graham.wallace@bankhouseworcester.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'lmiller@fillongleyspringwater.co.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'tony59tern@aol.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;

-- create crm entities for private beta 2 internal users
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'defradigital@litmustest.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'lee.murray@defra.gsi.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'mywail@mailinator.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'andrewhick.ea@gmail.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'andrewhick.ea+john@gmail.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'andrewhick.ea+geoff@gmail.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'andrewhick.ea+wendy@gmail.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'andrewhick.ea+james@gmail.com','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'freya.chappell@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'paula.french@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'daniel.timney@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'rachel.grant@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'elliot.pain@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'katy.steed@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'rory.callan@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'hazel.sumner@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'gemma.house@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'sarah.stuchbury@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'sarah.hainie@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'Naginder.Dhanoa@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'jamie.byrne@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'vernon.smith@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'carla.smith@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'beverley.atkinson@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'ian.johnson@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'paul.crane@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'mark.harvett@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'richard.austen@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'jenni.balmer@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'rachel.hughes01@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'harriet.gurney@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'lorraine.ramsden@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'julie.turton@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'ann.mcguire@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'gillian.roe@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'margaret.neal@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'anne.taylor@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'dane.broomfield@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'steve.lawrie@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'paul.sadler@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;
insert into crm.entity (	entity_id,entity_nm,entity_type) values (uuid_in(md5(random()::text || now()::text)::cstring),'kate.liversedge@environment-agency.gov.uk','individual') on conflict (entity_nm,entity_type) DO NOTHING;


-- SET UP A john

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='andrewhick.ea+john@gmail.com'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'F HAINES AND SONS' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'andrewhick.ea+john@gmail.com';

-- Wendy
delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='andrewhick.ea+wendy@gmail.com'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'E C DRUMMOND AND SON' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'andrewhick.ea+wendy@gmail.com';

-- Geoff
delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='andrewhick.ea+geoff@gmail.com'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'agent', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'F HAINES AND SONS' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'andrewhick.ea+geoff@gmail.com';
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'agent', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'FURNACE MILL FISHERIES' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'andrewhick.ea+geoff@gmail.com';


-- create admin roles for env agency users
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'freya.chappell@environment-agency.gov.uk' on conflict (entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';


insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'paula.french@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'daniel.timney@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'rachel.grant@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'elliot.pain@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'katy.steed@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'rory.callan@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'hazel.sumner@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'gemma.house@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'sarah.stuchbury@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'sarah.hainie@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'Naginder.Dhanoa@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'jamie.byrne@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'vernon.smith@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'carla.smith@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'beverley.atkinson@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'ian.johnson@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'paul.crane@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'mark.harvett@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'richard.austen@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'jenni.balmer@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'rachel.hughes01@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'harriet.gurney@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'lorraine.ramsden@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'julie.turton@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'ann.mcguire@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'gillian.roe@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'margaret.neal@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'anne.taylor@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'dane.broomfield@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'steve.lawrie@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'paul.sadler@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, null,1 from entity i join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'kate.liversedge@environment-agency.gov.uk' on conflict(entity_id,regime_entity_id,company_entity_id) do update set role = 'admin';


-- delete roles for users from private beta and reload and set company_id for documents
delete from crm.entity_roles where entity_id in (

select entity_id from crm.entity where entity_nm='rnwalker74@gmail.com'
) and entity_role_id is not null;

insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =

'ASHBOURNE GOLF CLUB LIMITED' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=

'rnwalker74@gmail.com';



update crm.document_header set company_entity_id=(


select entity_id from crm.entity where entity_nm='ASHBOURNE GOLF CLUB LIMITED'

) where system_external_id in (

'03/28/29/0076/1'

);


delete from crm.entity_roles where entity_id in (

select entity_id from crm.entity where entity_nm='robert@davidaustinroses.co.uk'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =

'DAVID AUSTIN ROSES LTD' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=

'robert@davidaustinroses.co.uk';




update crm.document_header set company_entity_id=(


select entity_id from crm.entity where entity_nm='DAVID AUSTIN ROSES LTD'

) where system_external_id in (

'18/54/05/0069'

);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='Jamie.Weall@astonmanor.co.uk'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'ASTON MANOR BREWERY CO LTD' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'Jamie.Weall@astonmanor.co.uk';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='ASTON MANOR BREWERY CO LTD'
) where system_external_id in (
'MD/054/0008/022'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='deepa.valand@tarmac.com'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'Tarmac Building Products Limited' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'deepa.valand@tarmac.com';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='Tarmac Building Products Limited'
) where system_external_id in (
'03/28/03/0215'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='edward@furnacemill.net'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'FURNACE MILL FISHERIES' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'edward@furnacemill.net';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='FURNACE MILL FISHERIES'
) where system_external_id in (
'18/54/02/0595'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='f.hainesandsons@btconnect.com'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'F HAINES AND SONS' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'f.hainesandsons@btconnect.com';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='F HAINES AND SONS'
) where system_external_id in (
'18/54/17/0361'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='graham.wallace@bankhouseworcester.com'
)
;
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'Bransford Lodge Limited' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'graham.wallace@bankhouseworcester.com';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='Bransford Lodge Limited'
) where system_external_id in (
'18/54/09/0577'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='lmiller@fillongleyspringwater.co.uk'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'Fillongley Spring Water Limited' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'lmiller@fillongleyspringwater.co.uk';


update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='Fillongley Spring Water Limited'
) where system_external_id in (
'MD/028/0015/002'
);

delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='tony59tern@aol.com'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'AI & S CROW' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'tony59tern@aol.com';

update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='AI & S CROW'
) where system_external_id in (
'18/54/04/1298'
);


delete from crm.entity_roles where entity_id in (
select entity_id from crm.entity where entity_nm='eric@ecdrummond.co.uk'
);
insert into crm.entity_roles(entity_role_id,entity_id,role,regime_entity_id,company_entity_id,is_primary)
select uuid_in(md5(random()::text || now()::text)::cstring), i.entity_id, 'admin', r.entity_id, c.entity_id,1 from entity i join entity c on c.entity_nm =
'E C DRUMMOND AND SON' join entity r on r.entity_nm = 'water-abstraction' where i.entity_nm=
'eric@ecdrummond.co.uk';

update crm.document_header set company_entity_id=(

select entity_id from crm.entity where entity_nm='E C DRUMMOND AND SON'
) where system_external_id in (
'19/55/18/0487','19/55/18/0436','WA/055/0018/009' ,'19/55/18/0061','18/54/13/0381','WA/055/0018/007'
);
