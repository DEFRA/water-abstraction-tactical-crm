'use strict'

const controller = require('./controller')
const config = require('../../../../config')

if (!config.isProduction) {
  exports.deleteTestData = {
    method: 'DELETE',
    path: '/crm/2.0/test-data',
    handler: controller.deleteTestData,
    options: {
      description: 'Deletes all the test data'
    }
  }
}
