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

    test('can add relations', async () => {
      await helpers.findOne(model, 'testKey', 'test-id', ['one', 'two']);
      const [options] = model.fetch.lastCall.args;
      expect(options.withRelated).to.equal(['one', 'two']);
    });

    test('will not throw if no entity found', async () => {
      const [options] = model.fetch.lastCall.args;
      expect(options.require).to.equal(false);
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

  experiment('.findMostRecent', () => {
    let result;
    let model;

    beforeEach(async () => {
      result = {
        toJSON: sandbox.spy()
      };
      model = {
        forge: sandbox.stub().returnsThis(),
        where: sandbox.stub().returnsThis(),
        orderBy: sandbox.stub().returnsThis(),
        fetchPage: sandbox.stub().resolves([result])
      };

      await helpers.findMostRecent(model, 'testKey', 'test-id');
    });

    test('filters the result', async () => {
      const [idFilter] = model.where.lastCall.args;
      expect(idFilter).to.equal({
        test_key: 'test-id'
      });
    });

    test('orders the results in descending order by start date', async () => {
      const [column, sortOrder] = model.orderBy.lastCall.args;
      expect(column).to.equal('start_date');
      expect(sortOrder).to.equal('desc');
    });

    test('fetches the first record', async () => {
      const [{ page, pageSize }] = model.fetchPage.lastCall.args;
      expect(page).to.equal(1);
      expect(pageSize).to.equal(1);
    });

    test('returns the entity as JSON', async () => {
      expect(result.toJSON.called).to.equal(true);
    });
  });
});
