'use strict'

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const routes = require('../../../../src/v2/modules/test-data/routes')
const { createServerForRoute } = require('../../../helpers')

experiment('v2/modules/test-data/routes', () => {
  experiment('deleteTestData', () => {
    let server

    const createRequest = () => ({
      method: 'DELETE',
      url: '/crm/2.0/test-data'
    })

    beforeEach(() => {
      server = createServerForRoute(routes.deleteTestData)
    })

    test('calls through to the controller handler', async () => {
      const request = createRequest()
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(200)
    })
  })
})
