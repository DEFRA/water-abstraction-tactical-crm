const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const InvoiceAccount = require('../../../../src/v2/connectors/bookshelf/InvoiceAccount');

experiment('v2/connectors/bookshelf/InvoiceAccount', () => {
  let instance;

  beforeEach(async () => {
    instance = InvoiceAccount.forge();
  });

  test('uses the address table', async () => {
    expect(instance.tableName).to.equal('invoice_accounts');
  });

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('invoice_account_id');
  });

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated']);
  });

  test('defines a company relation', async () => {
    expect(instance.company).to.be.a.function();
  });

  test('defines an invoiceAccountAddresses relation', async () => {
    expect(instance.invoiceAccountAddresses).to.be.a.function();
  });
});
