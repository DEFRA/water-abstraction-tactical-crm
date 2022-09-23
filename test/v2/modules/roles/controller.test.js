'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const { logger } = require('../../../../src/logger')
const controller = require('../../../../src/v2/modules/roles/controller')
const rolesService = require('../../../../src/v2/services/roles')

experiment('modules/roles/controller', () => {
  beforeEach(async () => {
    sandbox.stub(rolesService, 'getRoleByName')
    sandbox.stub(logger, 'error')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('.getRoleByName', () => {
    let request

    beforeEach(async () => {
      request = {
        params: {
          roleName: 'billing'
        }
      }
    })

    test('returns a not found if the role is not found', async () => {
      rolesService.getRoleByName.resolves(null)

      const response = await controller.getRoleByName(request)
      expect(response.output.statusCode).to.equal(404)
      expect(response.isBoom).to.equal(true)
    })

    test('calls through to the service with the role name', async () => {
      rolesService.getRoleByName.resolves(null)

      await controller.getRoleByName(request)

      const [roleName] = rolesService.getRoleByName.lastCall.args
      expect(roleName).to.equal(request.params.roleName)
    })

    test('returns the role when found', async () => {
      rolesService.getRoleByName.resolves({
        name: 'billing'
      })

      const response = await controller.getRoleByName(request)
      expect(response.name).to.equal('billing')
    })

    experiment('if there is an unexpected error', () => {
      let response
      beforeEach(async () => {
        rolesService.getRoleByName.rejects('bad news')
        response = await controller.getRoleByName(request)
      })

      test('the error is logger', async () => {
        const [message] = logger.error.lastCall.args
        expect(message).to.equal('Error getting role')
      })

      test('a Boom error is returned', async () => {
        expect(response.isBoom).to.equal(true)
      })
    })
  })
})
