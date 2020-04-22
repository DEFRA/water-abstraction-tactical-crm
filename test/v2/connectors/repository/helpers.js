'use strict';

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const helpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/helpers', () => {
  experiment('.findOne', () => {
    let result;
    let model;

    beforeEach(async () => {
      result = {
        toJSON: sandbox.spy()
      };
      model = {
        forge: sandbox.stub().returnsThis(),
        fetch: sandbox.stub().resolves(result)
      };

      await helpers.findOne(model, 'testKey', 'test-id');
    });

    test('calls forge on the model with the id', async () => {
      const [idFilter] = model.forge.lastCall.args;
      expect(idFilter).to.equal({
        testKey: 'test-id'
      });
    });

    test('fetches the data', async () => {
      const [idFilter] = model.forge.lastCall.args;
      expect(idFilter).to.equal({
        testKey: 'test-id'
      });
    });

    test('returns the entity as JSON when found', async () => {
      expect(result.toJSON.called).to.equal(true);
    });

    test('returns null if no data found', async () => {
      model.fetch.resolves(null);
      const data = await helpers.findOne(model, 'testKey', 'test-id');
      expect(data).to.equal(null);
    });
  });

  experiment('.create', () => {
    let result;
    let model;

    beforeEach(async () => {
      result = {
        toJSON: sandbox.spy()
      };
      model = {
        forge: sandbox.stub().returnsThis(),
        save: sandbox.stub().resolves(result)
      };

      await helpers.create(model, {
        day: 'Friday'
      });
    });

    test('calls forge on the model with the data', async () => {
      const [data] = model.forge.lastCall.args;
      expect(data).to.equal({
        day: 'Friday'
      });
    });

    test('returns the entity as JSON', async () => {
      expect(result.toJSON.called).to.equal(true);
    });
  });
});