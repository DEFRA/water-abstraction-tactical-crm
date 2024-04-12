'use strict'

exports.deleteTestInvoiceAccounts = `
DELETE from crm_v2.invoice_accounts where company_id IN (SELECT company_id from crm_v2.companies where is_test = true);`

exports.updateInvoiceAccountsWithCustomerFileReference = `
UPDATE crm_v2.invoice_accounts SET
last_transaction_file_reference = :fileReference,
date_last_transaction_file_reference_updated = :exportedAt
WHERE invoice_account_number = ANY(string_to_array(:exportedCustomers, ','))
`
