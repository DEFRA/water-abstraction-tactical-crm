const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const Company = require('../../../../src/v2/connectors/bookshelf/Company');

experiment('v2/connectors/bookshelf/Company', () => {
  let instance;

  beforeEach(async () => {
    instance = Company.forge();
  });

  test('uses the address table', async () => {
    expect(instance.tableName).to.equal('companies');
  });

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('company_id');
  });

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated']);
  });

  test('defines an invoiceAccounts relation', async () => {
    expect(instance.invoiceAccounts).to.be.a.function();
  });
});
