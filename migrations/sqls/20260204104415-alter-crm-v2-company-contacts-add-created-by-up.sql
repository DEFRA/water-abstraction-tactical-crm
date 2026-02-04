/*
 This migration adds created_by and updated_by columns to company_contacts table

 This will be used for auditing purposes
 */

ALTER TABLE crm_v2.company_contacts
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID;
