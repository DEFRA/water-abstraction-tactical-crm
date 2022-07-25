'use strict'

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const helpers = require('../../../../src/v2/connectors/repository/helpers')

experiment('v2/connectors/repository/helpers', () => {
  let result
  let model
  beforeEach(() => {
    result = {
      toJSON: sandbox.spy()
    }
    model = {
      forge: sandbox.stub().returnsThis(),
      where: sandbox.stub().returnsThis(),
      fetch: sandbox.stub().resolves(result),
      save: sandbox.stub().resolves(result),
      fetchAll: sandbox.stub().resolves(result),
      destroy: sandbox.stub().resolves()
    }
  })

  experiment('.findOne', () => {
    beforeEach(async () => {
      await helpers.findOne(model, 'testKey', 'test-id')
    })

    test('calls forge on the model with the id', async () => {
      const [idFilter] = model.forge.lastCall.args
      expect(idFilter).to.equal({
        testKey: 'test-id'
      })
    })

    test('returns the entity as JSON when found', async () => {
      expect(result.toJSON.called).to.equal(true)
    })

    test('returns null if no data found', async () => {
      model.fetch.resolves(null)
      const data = await helpers.findOne(model, 'testKey', 'test-id')
      expect(data).to.equal(null)
    })

    test('can add relations', async () => {
      await helpers.findOne(model, 'testKey', 'test-id', ['one', 'two'])
      const [options] = model.fetch.lastCall.args
      expect(options.withRelated).to.equal(['one', 'two'])
    })

    test('will not throw if no entity found', async () => {
      const [options] = model.fetch.lastCall.args
      expect(options.require).to.equal(false)
    })
  })

  experiment('.create', () => {
    beforeEach(async () => {
      await helpers.create(model, { day: 'Friday' })
    })

    test('calls forge on the model with the data', async () => {
      const [data] = model.forge.lastCall.args
      expect(data).to.equal({
        day: 'Friday'
      })
    })

    test('returns the entity as JSON', async () => {
      expect(result.toJSON.called).to.equal(true)
    })
  })

  experiment('.findAll', () => {
    beforeEach(async () => {
      await helpers.findAll(model, 'testKey', 'test-id')
    })

    test('filters the result', async () => {
      const [idFilter] = model.where.lastCall.args
      expect(idFilter).to.equal({
        test_key: 'test-id'
      })
    })

    test('fetches all relevant data', async () => {
      expect(model.fetchAll.called).to.be.true()
    })

    test('will not throw if no entity found', async () => {
      const [options] = model.fetchAll.lastCall.args
      expect(options.require).to.equal(false)
    })

    test('returns the entity as JSON', async () => {
      expect(result.toJSON.called).to.equal(true)
    })
  })

  experiment('.findMany', () => {
    beforeEach(async () => {
      await helpers.findMany(model, { test_key: 'testValue' }, ['test-model'])
    })

    test('filters the result', async () => {
      const [filter] = model.where.lastCall.args
      expect(filter).to.equal({
        test_key: 'testValue'
      })
    })

    test('fetches all relevant data', async () => {
      expect(model.fetchAll.called).to.be.true()
    })

    test('fetches related models when provided', async () => {
      const [{ withRelated }] = model.fetchAll.lastCall.args
      expect(withRelated).to.equal(['test-model'])
    })

    test('will not throw if no entity found', async () => {
      const [options] = model.fetchAll.lastCall.args
      expect(options.require).to.equal(false)
    })

    test('returns the entity as JSON', async () => {
      expect(result.toJSON.called).to.equal(true)
    })
  })

  experiment('.deleteTestData', () => {
    beforeEach(async () => {
      await helpers.deleteTestData(model)
    })

    test('calls forge on the model', async () => {
      expect(model.forge.called).to.equal(true)
    })

    test('filters where is_test is true', async () => {
      const [where] = model.where.lastCall.args
      expect(where).to.equal({ is_test: true })
    })

    test('deletes the data but does not require a match', async () => {
      const [destroy] = model.destroy.lastCall.args
      expect(destroy).to.equal({ require: false })
    })
  })

  experiment('.update', () => {
    const changes = { foo: 'bar' }

    beforeEach(async () => {
      await helpers.update(model, 'testKey', 'test-id', changes)
    })

    test('calls forge on the model with the id', async () => {
      const [idFilter] = model.forge.lastCall.args
      expect(idFilter).to.equal({
        testKey: 'test-id'
      })
    })

    test('calls save on the model with the changes', async () => {
      expect(model.save.calledWith(changes)).to.be.true()
    })

    test('returns the entity as JSON when found', async () => {
      expect(result.toJSON.called).to.equal(true)
    })

    test('returns null if no data found', async () => {
      model.fetch.resolves(null)
      const data = await helpers.findOne(model, 'testKey', 'test-id')
      expect(data).to.equal(null)
    })
  })
})
