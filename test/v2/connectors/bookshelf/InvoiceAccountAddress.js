const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const InvoiceAccountAddress = require('../../../../src/v2/connectors/bookshelf/InvoiceAccountAddress');

experiment('v2/connectors/bookshelf/InvoiceAccountAddress', () => {
  let instance;

  beforeEach(async () => {
    instance = InvoiceAccountAddress.forge();
  });

  test('uses the address table', async () => {
    expect(instance.tableName).to.equal('invoice_account_addresses');
  });

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('invoice_account_address_id');
  });

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated']);
  });

  test('defines an address relation', async () => {
    expect(instance.address).to.be.a.function();
  });

  test('defines an invoiceAccount relation', async () => {
    expect(instance.invoiceAccount).to.be.a.function();
  });
});
