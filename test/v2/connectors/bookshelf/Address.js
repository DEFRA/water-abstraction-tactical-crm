const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const Address = require('../../../../src/v2/connectors/bookshelf/Address');

experiment('v2/connectors/bookshelf/Address', () => {
  let instance;

  beforeEach(async () => {
    instance = Address.forge();
  });

  test('uses the address table', async () => {
    expect(instance.tableName).to.equal('crm_v2.addresses');
  });

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('address_id');
  });

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated']);
  });

  test('has a companyAddresses relationship', async () => {
    expect(instance.companyAddresses).to.be.a.function();
  });
});
