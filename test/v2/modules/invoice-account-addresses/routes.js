'use strict'

const Hapi = require('@hapi/hapi')
const { cloneDeep, omit } = require('lodash')
const { v4: uuid } = require('uuid')

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const routes = require('../../../../src/v2/modules/invoice-account-addresses/routes')

const createServer = route => {
  const server = Hapi.server()
  const testRoute = cloneDeep(route)
  testRoute.handler = async () => 'ok'

  server.route(testRoute)

  return server
}

experiment('v2/modules/invoice-account-addresses/routes', () => {
  experiment('.postInvoiceAccountAddress', () => {
    let server

    const defaults = {
      addressId: uuid(),
      startDate: '2020-04-01',
      endDate: '2020-12-25',
      agentCompanyId: null,
      contactId: null
    }

    const getRequest = (invoiceAccountId, payload = {}, omitKeys = []) => ({
      method: 'POST',
      url: `/crm/2.0/invoice-accounts/${invoiceAccountId}/addresses`,
      payload: omit({
        ...defaults,
        ...payload
      }, omitKeys)
    })

    beforeEach(() => {
      server = createServer(routes.postInvoiceAccountAddress)
    })

    experiment('returns a 400', () => {
      test('if the invoice account id is not a guid', async () => {
        const request = getRequest(123)
        const response = await server.inject(request)
        expect(response.statusCode).to.equal(400)
      })

      experiment('if the addressId', () => {
        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'addressId')
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })

        test('is not a guid', async () => {
          const request = getRequest(uuid(), {
            addressId: '123abc'
          })
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })
      })

      experiment('if the startDate', () => {
        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'startDate')
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })

        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            startDate: '2020-04-31'
          })
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })
      })

      experiment('if the endDate', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            endDate: '2020-12-35'
          })
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })

        test('is before the startDate', async () => {
          const request = getRequest(uuid(), {
            startDate: '2020-04-01',
            endDate: '2020-01-01'
          })
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })
      })

      experiment('if isTest', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            isTest: 'yes'
          })
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })
      })

      experiment('if agentCompanyId', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            agentCompanyId: 'not-a-guid'
          })
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })

        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'agentCompanyId')
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })
      })

      experiment('if contactId', () => {
        test('is not valid', async () => {
          const request = getRequest(uuid(), {
            contactId: 'not-a-guid'
          })
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })

        test('is omitted', async () => {
          const request = getRequest(uuid(), {}, 'contactId')
          const response = await server.inject(request)
          expect(response.statusCode).to.equal(400)
        })
      })
    })
    experiment('the endDate', () => {
      test('can be set to null', async () => {
        const request = getRequest(uuid(), {
          endDate: null
        })
        const response = await server.inject(request)
        expect(response.statusCode).to.equal(200)
      })

      test('defaults to null if not provided', async () => {
        const request = getRequest(uuid(), {}, 'endDate')
        const response = await server.inject(request)
        expect(response.request.payload.endDate).to.be.null()
      })

      test('can be set to a valid date', async () => {
        const request = getRequest(uuid(), {
          endDate: '2020-12-31'
        })
        const response = await server.inject(request)
        expect(response.statusCode).to.equal(200)
      })
    })

    experiment('isTest', () => {
      test('defaults to false if not provided', async () => {
        const request = getRequest(uuid(), {}, 'isTest')
        const response = await server.inject(request)
        expect(response.request.payload.isTest).to.be.false()
      })

      test('can be set to a boolean', async () => {
        const request = getRequest(uuid(), {
          isTest: true
        })

        const response = await server.inject(request)
        expect(response.statusCode).to.equal(200)
        expect(response.request.payload.isTest).to.be.true()
      })
    })

    experiment('agentCompanyId', () => {
      test('can be set to a guid', async () => {
        const request = getRequest(uuid(), {
          agentCompanyId: uuid()
        })
        const response = await server.inject(request)
        expect(response.statusCode).to.equal(200)
        expect(response.request.payload.agentCompanyId).to.equal(request.payload.agentCompanyId)
      })

      test('can be set to null', async () => {
        const request = getRequest(uuid(), {
          agentCompanyId: null
        })
        const response = await server.inject(request)
        expect(response.statusCode).to.equal(200)
        expect(response.request.payload.agentCompanyId).to.equal(null)
      })
    })

    experiment('contactId', () => {
      test('can be set to a guid', async () => {
        const request = getRequest(uuid(), {
          contactId: uuid()
        })
        const response = await server.inject(request)
        expect(response.statusCode).to.equal(200)
        expect(response.request.payload.contactId).to.equal(request.payload.contactId)
      })

      test('can be set to null', async () => {
        const request = getRequest(uuid(), {
          contactId: null
        })
        const response = await server.inject(request)
        expect(response.statusCode).to.equal(200)
        expect(response.request.payload.contactId).to.equal(null)
      })
    })
  })

  experiment('.deleteInvoiceAccountAddress', () => {
    let server

    const getRequest = invoiceAccountAddressId => ({
      method: 'DELETE',
      url: `/crm/2.0/invoice-account-addresses/${invoiceAccountAddressId}`
    })

    beforeEach(() => {
      server = createServer(routes.deleteInvoiceAccountAddress)
    })

    test('returns a 400 if the invoice account address id is not a guid', async () => {
      const request = getRequest(123)
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(400)
    })

    test('returns a 200 if the invoice account address id is a guid', async () => {
      const request = getRequest(uuid())
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(200)
    })
  })
})
