ALTER TABLE crm_v2.addresses
  ADD CONSTRAINT unique_address_uprn UNIQUE (uprn);