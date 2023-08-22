const { test, experiment } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const controller = require('../../src/controllers/status')

experiment('controllers/status', () => {
  experiment('getStatus', () => {
    test('returns an object with the application status', () => {
      const response = controller.getStatus()
      expect(response.status).to.equal('alive')
    })
  })
})
