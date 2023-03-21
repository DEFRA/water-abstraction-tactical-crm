'use strict'

// Test framework dependencies
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Sinon = require('sinon')

const { experiment, test, beforeEach, afterEach } = exports.lab = Lab.script()
const { expect } = Code

// Things we need to stub
const { bookshelf } = require('../../../src/v2/connectors/bookshelf/index.js')

// Thing under test
const InvoiceAccountNumber = require('../../../src/v2/services/invoice-account-number.js')

experiment('Invoice account number', () => {
  afterEach(() => {
    Sinon.restore()
  })

  experiment('.generate()', () => {
    experiment('when checking the first 1000 records', () => {
      experiment('and there are unused references', () => {
        beforeEach(() => {
          const existingMatches = _generateExistingMatches(1, 5)
          Sinon.stub(bookshelf.knex, 'pluck').returns(_pluckStub(existingMatches))
        })

        test('returns the first available', async () => {
          const result = await InvoiceAccountNumber.generate('B')

          expect(result).to.equal('B00000006A')
        })
      })

      experiment('and there are no available references', () => {
        let pluckStub

        beforeEach(() => {
          const existingMatchesFull = _generateExistingMatches(1, 1000)
          const existingMatchesAvailable = _generateExistingMatches(1001, 5)
          pluckStub = _pluckStub(existingMatchesFull, existingMatchesAvailable)

          Sinon.stub(bookshelf.knex, 'pluck').returns(pluckStub)
        })

        test('queries the DB again to find an available reference', async () => {
          const result = await InvoiceAccountNumber.generate('B')

          expect(pluckStub.from.callCount).to.equal(2)
          expect(result).to.equal('B00001006A')
        })
      })
    })
  })
})

function _pluckStub (existingMatchesFirstCall, existingMatchesSecondCall = null) {
  return {
    from: Sinon.stub().returnsThis(),
    whereIn: Sinon.stub()
      .onFirstCall().returns(existingMatchesFirstCall)
      .onSecondCall().returns(existingMatchesSecondCall)
  }
}

function _generateExistingMatches (start, length) {
  return Array.from({ length }, (_, i) => `B${(i + start).toString().padStart(8, '0')}A`)
}
