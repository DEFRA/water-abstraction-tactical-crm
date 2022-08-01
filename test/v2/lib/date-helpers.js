'use strict'

const { expect } = require('@hapi/code')
const { experiment, test, beforeEach } = exports.lab = require('@hapi/lab').script()

const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(require('moment'))

const dateHelpers = require('../../../src/v2/lib/date-helpers')

experiment('v2/lib/date-helpers', () => {
  experiment('.getDateRange', () => {
    let obj

    beforeEach(() => {
      obj = { startDate: '2020-04-01', endDate: '2020-12-31' }
    })

    test('returns a moment range with correct dates', () => {
      const dateRange = dateHelpers.getDateRange(obj)

      expect(moment.isRange(dateRange)).to.be.true()
      expect(dateRange.start).to.equal(moment(obj.startDate, 'YYYY-MM-DD'))
      expect(dateRange.end).to.equal(moment(obj.endDate, 'YYYY-MM-DD'))
    })

    test('handles a null end date', () => {
      obj.endDate = null
      const dateRange = dateHelpers.getDateRange(obj)

      expect(moment.isRange(dateRange)).to.be.true()
      expect(dateRange.start).to.equal(moment(obj.startDate, 'YYYY-MM-DD'))
      expect(moment().isValid(dateRange.end)).to.be.true()
    })

    test('handles omitted end date', () => {
      delete obj.endDate
      const dateRange = dateHelpers.getDateRange(obj)

      expect(moment.isRange(dateRange)).to.be.true()
      expect(dateRange.start).to.equal(moment(obj.startDate, 'YYYY-MM-DD'))
      expect(moment().isValid(dateRange.end)).to.be.true()
    })
  })

  experiment('.hasOverlap', () => {
    let existingEntities

    beforeEach(() => {
      existingEntities = [
        { startDate: '2016-01-01', endDate: '2018-05-02' },
        { startDate: '2018-05-03', endDate: '2020-12-31' }]
    })

    experiment('when the dates overlap', () => {
      const overlapScenarios = [
        // starts before and ends after incoming data
        { startDate: '2015-01-01', endDate: '2022-01-01' },
        { startDate: '2015-01-01', endDate: null },

        // starts after existing started, but before finished
        { startDate: '2019-01-01', endDate: '2022-01-01' },
        { startDate: '2019-01-01', endDate: null },

        // starts and ends within existing data
        { startDate: '2019-01-01', endDate: '2020-01-01' }
      ]

      overlapScenarios.forEach(scenario => {
        const { startDate, endDate } = scenario
        test(`returns true for incoming date with start ${startDate} and end ${endDate}`, () => {
          const result = dateHelpers.hasOverlap(scenario, existingEntities)
          expect(result).to.be.true()
        })
      })
    })
    experiment('when the dates do not overlap', () => {
      test('returns false', () => {
        const incomingDateRange = moment.range('2021-01-01', null)
        const result = dateHelpers.hasOverlap(incomingDateRange, existingEntities)
        expect(result).to.be.false()
      })
    })
  })
})
