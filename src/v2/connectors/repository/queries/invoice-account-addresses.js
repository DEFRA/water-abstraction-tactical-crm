exports.deleteTestInvoiceAccountAddresses = `
DELETE FROM crm_v2.invoice_account_addresses where invoice_account_id = 
  (SELECT invoice_account_id from crm_v2.invoice_accounts where company_id = 
    (SELECT company_id from crm_v2.companies where is_test = true));`;
