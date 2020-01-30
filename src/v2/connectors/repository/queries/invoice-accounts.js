const findWithoutWhereClause = `
  select
    ia.invoice_account_id as "invoice_account.invoice_account_id",
    ia.invoice_account_number as "invoice_account.invoice_account_number",
    ia.start_date as "invoice_account.start_date",
    ia.end_date as "invoice_account.end_date",
    ia.date_created as "invoice_account.date_created",
    ia.date_updated as "invoice_account.date_updated",
    c.company_id as "company.company_id",
    c.name as "company.name",
    c.type as "company.type",
    c.company_number as "company.company_number",
    c.external_id as "company.external_id",
    c.date_created as "company.date_created",
    c.date_updated as "company.date_updated"
  from crm_v2.invoice_accounts ia
    join crm_v2.companies c
      on ia.company_id = c.company_id
`;

exports.findManyByIds = `
  ${findWithoutWhereClause}
  where ia.invoice_account_id = any($1);
`;

exports.findOneById = `
  ${findWithoutWhereClause}
  where ia.invoice_account_id = $1;
`;
