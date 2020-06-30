exports.findOneByGreatestAccountNumber = `
select ia.invoice_account_number 
  from crm_v2.invoice_accounts ia
  where ia.invoice_account_number ilike :query
    and ia.is_test=false 
  order by regexp_replace(ia.invoice_account_number, '[^0-9]+', '', 'g')::integer desc 
  limit 1
`;
