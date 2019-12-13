exports.findOneById = `
  select
    contact_id,
    salutation,
    initials,
    first_name,
    middle_names,
    last_name,
    external_id,
    date_created,
    date_updated
  from crm_v2.contacts
  where contact_id = $1;
`;

exports.findManyById = `
  select
    contact_id,
    salutation,
    initials,
    first_name,
    middle_names,
    last_name,
    external_id,
    date_created,
    date_updated
  from crm_v2.contacts
  where contact_id = any ($1);
`;
