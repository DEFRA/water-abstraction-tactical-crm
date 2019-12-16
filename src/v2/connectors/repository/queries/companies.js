exports.findByInvoiceAccountIds = `
  select
    c.company_id,
    c.name,
    c.type,
    c.company_number,
    c.external_id,
    c.date_created,
    c.date_updated
  from crm_v2.companies c
    inner join crm_v2.invoice_accounts ia
      on c.company_id = ia.company_id
  where ia.invoice_account_id = any ($1);
`;
