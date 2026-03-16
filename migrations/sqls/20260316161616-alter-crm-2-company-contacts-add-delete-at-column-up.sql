/*
 This migration adds the deleted_at column to the company_contacts table

 This will be used for auditing purposes
 */

ALTER TABLE crm_v2.company_contacts
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
