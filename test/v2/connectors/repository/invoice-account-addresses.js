const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { invoiceAccountAddresses } = require('../../../../src/v2/connectors/repository');
const { InvoiceAccountAddress } = require('../../../../src/v2/connectors/bookshelf');

experiment('v2/connectors/repository/invoice-account-addresses', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ invoiceAccountAddressId: 'test-id' })
    };
    stub = {
      fetch: sandbox.stub(),
      where: sandbox.stub().returnsThis(),
      orderBy: sandbox.stub().returnsThis(),
      save: sandbox.stub().resolves(model),
      fetchPage: sandbox.stub().resolves([model])
    };
    sandbox.stub(InvoiceAccountAddress, 'forge').returns(stub);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.create', () => {
    let result;
    let invoiceAccountAddress;

    beforeEach(async () => {
      invoiceAccountAddress = { invoiceAccountId: 'test-invoice-account-id', addressId: 'test-address-id', startDate: '2020-04-01' };
      result = await invoiceAccountAddresses.create(invoiceAccountAddress);
    });

    test('.forge() is called on the model with the data', async () => {
      const [data] = InvoiceAccountAddress.forge.lastCall.args;
      expect(data).to.equal(invoiceAccountAddress);
    });

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.invoiceAccountAddressId).to.equal('test-id');
    });
  });

  experiment('.findMostRecent', () => {
    let result;
    let invoiceAccountId;

    beforeEach(async () => {
      invoiceAccountId = 'test-invoice-account-id';
      result = await invoiceAccountAddresses.findMostRecent(invoiceAccountId);
    });

    test('.forge() is called on the model', async () => {
      expect(InvoiceAccountAddress.forge.called).to.be.true();
    });

    test('.where() is called after the forge with filter', async () => {
      const [filter] = stub.where.lastCall.args;
      expect(filter).to.equal({ invoice_account_id: invoiceAccountId });
    });

    test('.orderBy() is called to order results', async () => {
      const [column, sortOrder] = stub.orderBy.lastCall.args;
      expect(column).to.equal('start_date');
      expect(sortOrder).to.equal('desc');
    });

    test('.fetchPage() is called to return first result', async () => {
      const [{ page, pageSize }] = stub.fetchPage.lastCall.args;
      expect(page).to.equal(1);
      expect(pageSize).to.equal(1);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.invoiceAccountAddressId).to.equal('test-id');
    });
  });
});
