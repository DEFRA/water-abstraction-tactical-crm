'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const controller = require('../../src/controllers/contacts')
const { logger } = require('../../src/logger')
const { pool } = require('../../src/lib/connectors/db')

experiment('controllers/contacts', () => {
  beforeEach(async () => {
    sandbox.stub(logger, 'error')
    sandbox.stub(pool, 'query')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('in the event of an error', () => {
    let response
    let request
    let h
    let code
    let error

    beforeEach(async () => {
      code = sandbox.stub().returns('response-test')
      h = {
        response: sandbox.stub().returns({ code })
      }
      request = {
        query: {
          filter: null
        }
      }
      error = new Error('oops')

      pool.query.rejects(error)
      response = await controller.getContacts(request, h)
    })

    test('the error is logged', async () => {
      const [msg, err, params] = logger.error.lastCall.args
      expect(msg).to.equal('getContacts error')
      expect(err).to.equal(error)
      expect(params).to.equal({
        filter: null
      })
    })

    test('the response is returned', async () => {
      expect(response).to.equal('response-test')
      expect(code.calledWith(500)).to.equal(true)
    })
  })
})
