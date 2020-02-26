const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const InvoiceAccount = require('../../../../src/v2/connectors/bookshelf/InvoiceAccount');

experiment('v2/connectors/bookshelf/InvoiceAccount', () => {
  let instance;

  beforeEach(async () => {
    instance = InvoiceAccount.forge();
    sandbox.stub(instance, 'hasOne');
    sandbox.stub(instance, 'hasMany');
  });

  afterEach(async () => {
    sandbox.restore();
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

  experiment('the .company() relation', () => {
    beforeEach(async () => {
      instance.company();
    });

    test('is a function', async () => {
      expect(instance.company).to.be.a.function();
    });

    test('calls .hasMany with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args;
      expect(model).to.equal('Company');
      expect(foreignKey).to.equal('company_id');
      expect(foreignKeyTarget).to.equal('company_id');
    });
  });

  experiment('the .invoiceAccountAddresses() relation', () => {
    beforeEach(async () => {
      instance.invoiceAccountAddresses();
    });

    test('is a function', async () => {
      expect(instance.invoiceAccountAddresses).to.be.a.function();
    });

    test('calls .hasMany with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasMany.lastCall.args;
      expect(model).to.equal('InvoiceAccountAddress');
      expect(foreignKey).to.equal('invoice_account_id');
      expect(foreignKeyTarget).to.equal('invoice_account_id');
    });
  });
});
