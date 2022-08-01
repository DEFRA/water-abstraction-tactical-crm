'use-strict'
const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()
const controller = require('../../../src/modules/kpi-reporting/controller')
const repos = require('../../../src/lib/repo/kpi-reporting')

experiment('./modules/kpi-reporting/controller', () => {
  const repoData = {
    data: [
      {
        current_year: true,
        total: 5,
        month: 3,
        year: 2020
      },
      {
        current_year: true,
        total: 20,
        month: 2,
        year: 2020
      },
      {
        current_year: true,
        total: 10,
        month: 1,
        year: 2020
      },
      {
        current_year: false,
        total: 100,
        month: 12,
        year: 2019
      }
    ],
    error: null
  }

  afterEach(() => {
    sandbox.restore()
  })

  experiment('when data is returned from the repo', () => {
    beforeEach(() => {
      sandbox.stub(repos, 'getEntityRolesKPIdata').resolves(repoData)
    })
    test('the right data shape is returned', async () => {
      const { data } = await controller.getKPIEntityRolesData()
      expect(data.totals.allTime).to.equal(135)
      expect(data.totals.ytd).to.equal(35)
      expect(Object.keys(data.monthly[0])).to.equal(['month', 'year', 'total', 'change'])
      expect(data.monthly[0].total).to.equal(5)
      expect(data.monthly[0].month).to.equal('March')
      expect(data.monthly[0].change).to.equal(-75)
    })
  })

  experiment('when no data is returned from the repo', () => {
    beforeEach(() => {
      sandbox.stub(repos, 'getEntityRolesKPIdata').resolves({ data: null, error: { message: 'blah is broken' } })
    })
    test('the right data shape is returned', async () => {
      const response = await controller.getKPIEntityRolesData()
      expect(response.isBoom).to.be.true()
      expect(response.output.payload.statusCode).to.equal(404)
      expect(response.output.payload.error).to.equal('Not Found')
      expect(response.output.payload.message).to.equal('Entity roles data not found')
    })
  })
})
