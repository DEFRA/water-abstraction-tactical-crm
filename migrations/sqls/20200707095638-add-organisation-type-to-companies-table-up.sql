create type crm_v2.organisation_type as enum ('individual', 'limitedCompany', 'partnership', 'limitedLiabilityPartnership');

alter table crm_v2.companies
  add column organisation_type crm_v2.organisation_type default null;