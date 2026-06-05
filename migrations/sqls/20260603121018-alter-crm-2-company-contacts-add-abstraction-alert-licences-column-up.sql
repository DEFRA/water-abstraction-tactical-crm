/*
 This migration adds the abstraction_alert_licences column to the company_contacts table
 */

ALTER TABLE crm_v2.company_contacts
  ADD COLUMN IF NOT EXISTS abstraction_alert_licences JSONB DEFAULT NULL;
