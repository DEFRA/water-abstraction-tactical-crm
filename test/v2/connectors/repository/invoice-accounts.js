const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { invoiceAccounts, invoiceAccountAddresses } = require('../../../../src/v2/connectors/repository');
const { InvoiceAccount } = require('../../../../src/v2/connectors/bookshelf');

experiment('v2/connectors/repository/invoice-account', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ invoiceAccountId: 'test-id' })
    };
    stub = {
      fetch: sandbox.stub(),
      where: sandbox.stub().returnsThis(),
      save: sandbox.stub().resolves(model)
    };
    sandbox.stub(InvoiceAccount, 'forge').returns(stub);
    sandbox.stub(InvoiceAccount, 'collection').returns(stub);
    sandbox.stub(invoiceAccountAddresses, 'create').resolves({ invoiceAccountAddressId: 'test-id' });
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.findOne', () => {
    let result;
    const invoiceAccountId = 'test-id';

    experiment('when a model is found', () => {
      beforeEach(async () => {
        stub.fetch.resolves(model);
        result = await invoiceAccounts.findOne(invoiceAccountId);
      });

      test('.forge() is called on the model with correct ID', async () => {
        expect(InvoiceAccount.forge.calledWith({
          invoice_account_id: invoiceAccountId
        }));
      });

      test('.fetch() is called on the model to get related models', async () => {
        const { withRelated } = stub.fetch.lastCall.args[0];
        expect(withRelated).to.include([
          'company',
          'invoiceAccountAddresses',
          'invoiceAccountAddresses.address'
        ]);
      });

      test('.fetch() is called with "require" option set to false', async () => {
        const { require } = stub.fetch.lastCall.args[0];
        expect(require).to.be.false();
      });

      test('.toJSON() is called on the returned model', async () => {
        expect(model.toJSON.called).to.be.true();
        expect(result).to.equal({ invoiceAccountId });
      });
    });

    experiment('when a model is not found', () => {
      beforeEach(async () => {
        stub.fetch.resolves(null);
        result = await invoiceAccounts.findOne(invoiceAccountId);
      });

      test('null is returned', async () => {
        expect(result).to.equal(null);
      });
    });
  });

  experiment('.findWithCurrentAddress', () => {
    let result;
    const invoiceAccountIds = ['id-1', 'id-2'];

    experiment('when model(s) are found', () => {
      beforeEach(async () => {
        model.toJSON.returns([{
          invoiceAccountId: 'id-1'
        }, {
          invoiceAccountId: 'id-2'
        }]);
        stub.fetch.resolves(model);
        result = await invoiceAccounts.findWithCurrentAddress(invoiceAccountIds);
      });

      test('.collection() is called on the model with correct IDs', async () => {
        expect(InvoiceAccount.collection.called).to.be.true();
      });

      test('.where() called on the model with correct filter', async () => {
        const [field, operator, values] = stub.where.lastCall.args;
        expect(field).to.equal('invoice_account_id');
        expect(operator).to.equal('in');
        expect(values).to.equal(invoiceAccountIds);
      });

      test('.fetch() called with correct related models', async () => {
        const { withRelated } = stub.fetch.lastCall.args[0];
        expect(withRelated).to.include('company');
        expect(withRelated[1].invoiceAccountAddresses).to.be.a.function();
        expect(withRelated).to.include('invoiceAccountAddresses.address');
      });

      test('.invoiceAccountAddresses selected are current - when end date is null', async () => {
        const qbStub = {
          where: sandbox.stub()
        };
        const { invoiceAccountAddresses } = stub.fetch.lastCall.args[0].withRelated[1];
        invoiceAccountAddresses(qbStub);
        expect(qbStub.where.calledWith(
          'end_date', null
        )).to.be.true();
      });

      test('.toJSON() is called on the collection', async () => {
        expect(model.toJSON.called).to.be.true();
      });
      test('resolves with an array of data', async () => {
        expect(result).to.be.an.array();
      });
    });
  });

  experiment('.create', () => {
    let result;
    let invoiceAccount;

    beforeEach(async () => {
      invoiceAccount = { companyId: 'test-company-id', invoiceAccountNumber: 'A12345678A', startDate: '2020-04-01' };
      result = await invoiceAccounts.create(invoiceAccount);
    });

    test('.forge() is called on the model with the data', async () => {
      const [data] = InvoiceAccount.forge.lastCall.args;
      expect(data).to.equal(invoiceAccount);
    });

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.invoiceAccountId).to.equal('test-id');
    });
  });

  experiment('.addAddress', () => {
    let result;
    let invoiceAccountAddress;

    beforeEach(async () => {
      invoiceAccountAddress = { invoiceAccountId: 'test-invoice-account-id', addressId: 'test-address-id', startDate: '2020-04-01' };
      result = await invoiceAccounts.addAddress(invoiceAccountAddress);
    });

    test('invoiceAccountAddresses .create is called with the data', async () => {
      const [data] = invoiceAccountAddresses.create.lastCall.args;
      expect(data).to.equal(invoiceAccountAddress);
    });

    test('returns the response from the invoiceAccountAddresses repo', async () => {
      expect(result).to.equal({ invoiceAccountAddressId: 'test-id' });
    });
  });
});
