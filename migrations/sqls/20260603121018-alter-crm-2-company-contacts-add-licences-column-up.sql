/*
 This migration adds the licences column to the company_contacts table
 */

ALTER TABLE crm_v2.company_contacts
  ADD COLUMN IF NOT EXISTS licences JSONB DEFAULT NULL;
