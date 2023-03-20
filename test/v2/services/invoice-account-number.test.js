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
  const fakeList = [1, 2, 3, 4]

  const pluckStub = {
    from: Sinon.stub().returnsThis(),
    whereIn: Sinon.stub().returns(fakeList)
  }

  beforeEach(() => {
    Sinon.stub(bookshelf.knex, 'pluck').returns(pluckStub)
  })

  afterEach(() => {
    Sinon.restore()
  })

  experiment('.generate()', () => {
    test('does something', async () => {
      const result = await InvoiceAccountNumber._findExistingMatches([])

      expect(result).to.equal(fakeList)
    })
  })
})
