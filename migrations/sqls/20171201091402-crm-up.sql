/*
 Navicat PostgreSQL Data Transfer

 Source Server         : local
 Source Server Type    : PostgreSQL
 Source Server Version : 90603
 Source Host           : localhost:5432
 Source Catalog        : permits
 Source Schema         : crm

 Target Server Type    : PostgreSQL
 Target Server Version : 90603
 File Encoding         : 65001

 Date: 01/12/2017 09:15:38
*/

CREATE SCHEMA IF NOT EXISTS crm;
set schema 'crm';

-- ----------------------------
-- Table structure for document_association
-- ----------------------------
DROP TABLE IF EXISTS "document_association";
CREATE TABLE "document_association" (
  "document_association_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "document_id" varchar COLLATE "pg_catalog"."default",
  "entity_id" varchar COLLATE "pg_catalog"."default"
)
;



-- ----------------------------
-- Table structure for document_header
-- ----------------------------
DROP TABLE IF EXISTS "document_header";
CREATE TABLE "document_header" (
  "document_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "regime_entity_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "system_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "system_internal_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "system_external_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "metadata" json,
  "company_entity_id" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for entity
-- ----------------------------
DROP TABLE IF EXISTS "entity";
CREATE TABLE "entity" (
  "entity_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_nm" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_type" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_definition" json
)
;

-- ----------------------------
-- Records of entity
-- ----------------------------
BEGIN;
INSERT INTO "entity" VALUES ('ff05340a-9fe4-2f22-12b0-c946a686a3d4', 'test1@example.com', 'individual', '{}');
INSERT INTO "entity" VALUES ('0434dc31-a34e-7158-5775-4694af7a60cf', 'water-abstraction', 'regime', '{}');
INSERT INTO "entity" VALUES ('cf1ee2c5-427c-1b0f-5016-52f12b6ece91', 'test2@example.com', 'individual', '{}');
COMMIT;

-- ----------------------------
-- Table structure for entity_association
-- ----------------------------
DROP TABLE IF EXISTS "entity_association";
CREATE TABLE "entity_association" (
  "entity_association_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_up_type" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_up_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_down_type" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_down_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "access_type" varchar COLLATE "pg_catalog"."default",
  "inheritable" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for entity_document_metadata
-- ----------------------------
DROP TABLE IF EXISTS "entity_document_metadata";
CREATE TABLE "entity_document_metadata" (
  "entity_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "document_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "key" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "value" varchar COLLATE "pg_catalog"."default"
)
;


-- ----------------------------
-- Table structure for entity_roles
-- ----------------------------
DROP TABLE IF EXISTS "entity_roles";
CREATE TABLE "entity_roles" (
  "entity_role_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "entity_id" varchar COLLATE "pg_catalog"."default",
  "role" varchar COLLATE "pg_catalog"."default",
  "regime_entity_id" varchar COLLATE "pg_catalog"."default",
  "company_entity_id" varchar COLLATE "pg_catalog"."default",
  "is_primary" int4
)
;



-- ----------------------------
-- Primary Key structure for table document_association
-- ----------------------------
ALTER TABLE "document_association" ADD CONSTRAINT "document_association_pkey" PRIMARY KEY ("document_association_id");

-- ----------------------------
-- Primary Key structure for table document_header
-- ----------------------------
ALTER TABLE "document_header" ADD CONSTRAINT "document_header_pkey" PRIMARY KEY ("document_id");

-- ----------------------------
-- Primary Key structure for table entity
-- ----------------------------
ALTER TABLE "entity" ADD CONSTRAINT "entity_pkey" PRIMARY KEY ("entity_id", "entity_nm", "entity_type");

-- ----------------------------
-- Primary Key structure for table entity_association
-- ----------------------------
ALTER TABLE "entity_association" ADD CONSTRAINT "entity_association_pkey" PRIMARY KEY ("entity_association_id", "entity_up_type", "entity_up_id", "entity_down_type", "entity_down_id");

-- ----------------------------
-- Primary Key structure for table entity_document_metadata
-- ----------------------------
ALTER TABLE "entity_document_metadata" ADD CONSTRAINT "entity_document_metadata_pkey" PRIMARY KEY ("entity_id", "key", "document_id");

-- ----------------------------
-- Primary Key structure for table entity_roles
-- ----------------------------
ALTER TABLE "entity_roles" ADD CONSTRAINT "entity_roles_pkey" PRIMARY KEY ("entity_role_id");
