const controller = require('./controller')
const { version } = require('../../../config')

module.exports = [{
  method: 'GET',
  path: `/crm/${version}/kpi/access-requests`,
  handler: controller.getKPIEntityRolesData,
  options: {
    description: 'Get access requests data for KPI reporting'
  }
}]
