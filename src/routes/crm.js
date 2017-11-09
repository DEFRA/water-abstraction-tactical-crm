/*

API operations only - NO UI

*/

const version = '1.0'

const CRM = require('../lib/CRM')


module.exports = [
  { method: 'GET', path: '/status', handler: function(request,reply){return reply('ok').code(200)}, config:{auth: false,description:'Get all entities'}},
  { method: 'GET', path: '/crm/' + version + '/entity', handler: CRM.getAllEntities, config:{description:'Get all entities'} },
  {  method: 'POST', path: '/crm/' + version + '/entity', handler: CRM.createNewEntity , config:{description:'Create new entity'}},
  {  method: 'GET', path: '/crm/' + version + '/entity/{entity_id}', handler: CRM.getEntity ,config:{description:'Get specified entity'}},
  {  method: 'PUT', path: '/crm/' + version + '/entity/{entity_id}', handler: CRM.updateEntity, config:{description:'Update specified entity'} },
  {  method: 'DELETE', path: '/crm/' + version + '/entity/{entity_id}', handler: CRM.deleteEntity ,config:{description:'Delete specified'}},
  {  method: 'GET', path: '/crm/' + version + '/entityAssociation', handler: CRM.getEntityAssociations ,config:{description:'Get associations for specified entity'}},
  {  method: 'POST', path: '/crm/' + version + '/entityAssociation', handler: CRM.createEntityAssociation ,config:{description:'Add association for specified entity'}},
  {  method: 'GET', path: '/crm/' + version + '/entityAssociation/{entity_association_id}', handler: CRM.getEntityAssociation ,config:{description:'Get specified association'}},
  {  method: 'PUT', path: '/crm/' + version + '/entityAssociation/{entity_association_id}', handler: CRM.updateEntityAssociation ,config:{description:'Update specified association'}},
  {  method: 'DELETE', path: '/crm/' + version + '/entityAssociation/{entity_association_id}', handler: CRM.deleteEntityAssociation ,config:{description:'Delete specified association'}},
  {  method: 'GET', path: '/crm/' + version + '/documentHeader', handler: CRM.getDocumentHeaders ,config:{description:'Get all document headers'}},
  {  method: 'POST', path: '/crm/' + version + '/documentHeader', handler: CRM.createDocumentHeader ,config:{description:'Create new document header'}},
  {  method: 'GET', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.getDocumentHeader ,config:{description:'Get specified document header by document id'}},
  {  method: 'GET', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.getDocumentHeader ,config:{description:'Get specified document header by external system & external system document id'}},
  {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.updateDocumentHeader ,config:{description:'Update specified document header by document id'}},
  {  method: 'PUT', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.updateDocumentHeader, config:{description:'Update specified document header by external system & external system document id'} },
  {  method: 'DELETE', path: '/crm/' + version + '/documentHeader/{document_id}', handler: CRM.deleteDocumentHeader ,config:{description:'Delete specified document header by document id'}},
  {  method: 'DELETE', path: '/crm/' + version + '/documentHeader/{system_id}/{system_internal_id}', handler: CRM.deleteDocumentHeader ,config:{description:'Delete specified document header by external system & external system document id'}},
  {  method: 'POST', path: '/crm/' + version + '/documentHeader/filter', handler: CRM.getDocumentHeaders ,config:{description:'Search for document headers by posted filter criteria'}}
]

/**

CREATE SCHEMA crm
    AUTHORIZATION postgres;
    -- Table: crm.document_header

    -- DROP TABLE crm.document_header;

    CREATE TABLE crm.document_header
    (
        document_id character varying COLLATE pg_catalog."default",
        regime_entity_id character varying COLLATE pg_catalog."default",
        system_id character varying COLLATE pg_catalog."default",
        system_internal_id character varying COLLATE pg_catalog."default",
        system_external_id character varying COLLATE pg_catalog."default",
        metadata json
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE crm.document_header
        OWNER to postgres;

    GRANT ALL ON TABLE crm.document_header TO postgres;

    -- Table: crm.entity

-- DROP TABLE crm.entity;

CREATE TABLE crm.entity
(
    entity_id character varying COLLATE pg_catalog."default" NOT NULL,
    entity_nm character varying COLLATE pg_catalog."default" NOT NULL,
    entity_type character varying COLLATE pg_catalog."default" NOT NULL,
    entity_definition json,
    CONSTRAINT entity_pkey PRIMARY KEY (entity_id, entity_nm, entity_type)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE crm.entity
    OWNER to postgres;

GRANT ALL ON TABLE crm.entity TO postgres;

-- Table: crm.entity_association

-- DROP TABLE crm.entity_association;

CREATE TABLE crm.entity_association
(
    entity_association_id character varying COLLATE pg_catalog."default" NOT NULL,
    entity_up_type character varying COLLATE pg_catalog."default" NOT NULL,
    entity_up_id character varying COLLATE pg_catalog."default" NOT NULL,
    entity_down_type character varying COLLATE pg_catalog."default" NOT NULL,
    entity_down_id character varying COLLATE pg_catalog."default" NOT NULL,
    access_type character varying COLLATE pg_catalog."default",
    inheritable character varying COLLATE pg_catalog."default",
    CONSTRAINT entity_association_pkey PRIMARY KEY (entity_association_id, entity_up_type, entity_up_id, entity_down_type, entity_down_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE crm.entity_association
    OWNER to postgres;

GRANT ALL ON TABLE crm.entity_association TO postgres;
**/
