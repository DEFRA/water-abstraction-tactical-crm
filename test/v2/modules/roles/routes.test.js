'use strict'

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const routes = require('../../../../src/v2/modules/roles/routes')
const { createServerForRoute } = require('../../../helpers')

experiment('modules/roles/routes', () => {
  experiment('getRoleByName', () => {
    let server

    const getRequest = roleName => ({
      method: 'GET',
      url: `/crm/2.0/roles/${roleName}`
    })

    beforeEach(async () => {
      server = createServerForRoute(routes.getRoleByName)
    })

    test('returns a 200 if the role name is a string', async () => {
      const request = getRequest('billing')
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(200)
    })
  })
})
