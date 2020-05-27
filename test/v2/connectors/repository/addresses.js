'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const addressesRepo = require('../../../../src/v2/connectors/repository/addresses');
const Address = require('../../../../src/v2/connectors/bookshelf/Address');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/addresses', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ id: 'test-id' })
    };

    stub = {
      save: sandbox.stub().resolves(model),
      fetch: sandbox.stub().resolves(model)
    };

    sandbox.stub(Address, 'forge').returns(stub);
    sandbox.stub(repoHelpers, 'deleteTestData');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.create', () => {
    let result;
    let address;

    beforeEach(async () => {
      address = { address1: 'test one', postcode: 'BS1 1SB' };
      result = await addressesRepo.create(address);
    });

    test('.forge() is called on the model with the data', async () => {
      const [data] = Address.forge.lastCall.args;
      expect(data).to.equal(address);
    });

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.id).to.equal('test-id');
    });
  });

  experiment('.findOne', () => {
    let result;

    experiment('when the id matches an address', () => {
      beforeEach(async () => {
        result = await addressesRepo.findOne('test-id');
      });

      test('.forge() is called on the model with the data', async () => {
        const [data] = Address.forge.lastCall.args;
        expect(data).to.equal({ addressId: 'test-id' });
      });

      test('.fetch() is called after the forge', async () => {
        expect(stub.fetch.called).to.equal(true);
      });

      test('the JSON representation is returned', async () => {
        expect(model.toJSON.called).to.be.true();
        expect(result.id).to.equal('test-id');
      });
    });

    experiment('when the id does not find an address', () => {
      beforeEach(async () => {
        stub.fetch.resolves(null);
        result = await addressesRepo.findOne('test-id');
      });

      test('.forge() is called on the model with the data', async () => {
        const [data] = Address.forge.lastCall.args;
        expect(data).to.equal({ addressId: 'test-id' });
      });

      test('.fetch() is called after the forge', async () => {
        expect(stub.fetch.called).to.equal(true);
      });

      test('null is returned', async () => {
        expect(result).to.equal(null);
      });
    });
  });

  experiment('.deleteTestData', () => {
    test('is created using the helpers', async () => {
      await addressesRepo.deleteTestData();

      const [model] = repoHelpers.deleteTestData.lastCall.args;
      expect(model).to.equal(Address);
    });
  });
});
