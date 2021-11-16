UPDATE crm_v2.contacts SET salutation = '' where salutation is NULL;
UPDATE crm_v2.contacts SET first_name = '' where first_name is NULL;
UPDATE crm_v2.contacts SET last_name = '' where last_name is NULL;
UPDATE crm_v2.contacts SET department = '' where department is NULL;
UPDATE crm_v2.contacts SET middle_initials = '' where middle_initials is NULL;
UPDATE crm_v2.contacts SET suffix = '' where suffix is NULL;