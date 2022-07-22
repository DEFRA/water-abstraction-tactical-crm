'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()
const sandbox = require('sinon').createSandbox()

const { expect } = require('@hapi/code')
const { v4: uuid } = require('uuid')
const querystring = require('querystring')

const routes = require('../../../../src/v2/modules/contacts/routes')
const entityHandler = require('../../../../src/v2/lib/entity-handlers')
const { createServerForRoute } = require('../../../helpers')

experiment('modules/contacts/routes', () => {
  afterEach(async () => {
    sandbox.restore()
  })

  experiment('getContact', () => {
    let server

    const createGetContactRequest = contactId => ({
      method: 'GET',
      url: `/crm/2.0/contacts/${contactId}`
    })

    beforeEach(async () => {
      sandbox.stub(entityHandler, 'getEntity')
      server = createServerForRoute(routes.getContact)
    })

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request')

      await routes.getContact.handler(request)

      const createArgs = entityHandler.getEntity.lastCall.args
      expect(createArgs[0]).to.equal(request)
      expect(createArgs[1]).to.equal('contact')
    })

    test('returns a 400 if contactId is not a uuid', async () => {
      const request = createGetContactRequest(123)
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(400)
    })

    test('returns a 200 if contactId is a uuid', async () => {
      const request = createGetContactRequest(uuid())
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(200)
    })
  })

  experiment('getContacts', () => {
    let server

    const createGetContactsRequest = contactIds => ({
      method: 'GET',
      url: `/crm/2.0/contacts?${querystring.stringify({
        ids: contactIds
      })}`
    })

    beforeEach(async () => {
      server = createServerForRoute(routes.getContacts)
    })

    test('returns a 200 for a single id', async () => {
      const request = createGetContactsRequest([uuid()])
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(200)
    })

    test('returns a 200 for multiple ids', async () => {
      const request = createGetContactsRequest([uuid(), uuid()])
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(200)
    })

    test('returns a 400 for if the id is not a uuid', async () => {
      const request = createGetContactsRequest([1234, uuid()])
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(400)
    })
  })

  experiment('postContact', () => {
    let server
    let fullPayload

    const getRequest = payload => ({
      method: 'POST',
      url: '/crm/2.0/contacts',
      payload
    })

    beforeEach(async () => {
      fullPayload = {
        type: 'person',
        salutation: 'Dr',
        firstName: 'Firsty',
        middleInitials: 'A',
        lastName: 'Lasty',
        isTest: true,
        department: 'Accounts',
        dataSource: 'wrls'
      }

      server = createServerForRoute(routes.postContact)
      sandbox.stub(entityHandler, 'createEntity')
    })

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request')
      const toolkit = Symbol('h')

      await routes.postContact.handler(request, toolkit)

      const createArgs = entityHandler.createEntity.lastCall.args
      expect(createArgs[0]).to.equal(request)
      expect(createArgs[1]).to.equal(toolkit)
      expect(createArgs[2]).to.equal('contact')
    })

    experiment('when a contact is being created', () => {
      test('type is required', async () => {
        delete fullPayload.type
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('isTest can be omitted', async () => {
        delete fullPayload.isTest
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('isTest defaults to false', async () => {
        delete fullPayload.isTest
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
        expect(response.request.payload.isTest).to.equal(false)
      })

      test('isTest must be boolean', async () => {
        fullPayload.isTest = 'Yes'

        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('the salutation is optional', async () => {
        delete fullPayload.salutation
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the salutation accepts a string', async () => {
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the salutation rejects a number', async () => {
        fullPayload.salutation = 1234
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('the firstName is optional', async () => {
        delete fullPayload.firstName
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the firstName accepts a string', async () => {
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the firstName rejects a number', async () => {
        fullPayload.firstName = 1234
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('the middleInitials is optional', async () => {
        delete fullPayload.middleInitials
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the middleInitials accepts a string', async () => {
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the middleInitials rejects a number', async () => {
        fullPayload.middleInitials = 1234
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('the lastName is optional', async () => {
        delete fullPayload.lastName
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the lastName accepts a string', async () => {
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the lastName rejects a number', async () => {
        fullPayload.lastName = 1234
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('the department is optional', async () => {
        delete fullPayload.department
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the department accepts a string', async () => {
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the department rejects a number', async () => {
        fullPayload.department = 1234
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('the dataSource is optional', async () => {
        delete fullPayload.dataSource
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(200)
      })

      test('the dataSource rejects a string that is not wrls|nald', async () => {
        fullPayload.dataSource = 'not-a-data-source'
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })

      test('the dataSource rejects a number', async () => {
        fullPayload.dataSource = 1234
        const request = getRequest(fullPayload)
        const response = await server.inject(request)

        expect(response.statusCode).to.equal(400)
      })
    })
  })

  experiment('deleteContact', () => {
    let server

    const createGetContactRequest = contactId => ({
      method: 'DELETE',
      url: `/crm/2.0/contacts/${contactId}`
    })

    beforeEach(async () => {
      sandbox.stub(entityHandler, 'deleteEntity')
      server = createServerForRoute(routes.deleteContact)
    })

    test('the handler is delegated to the entity handler', async () => {
      const request = Symbol('request')
      const toolkit = Symbol('h')

      await routes.deleteContact.handler(request, toolkit)

      const createArgs = entityHandler.deleteEntity.lastCall.args
      expect(createArgs[0]).to.equal(request)
      expect(createArgs[1]).to.equal(toolkit)
      expect(createArgs[2]).to.equal('contact')
    })

    test('returns a 400 if contactId is not a uuid', async () => {
      const request = createGetContactRequest(123)
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(400)
    })

    test('returns a 200 if contactId is a uuid', async () => {
      const request = createGetContactRequest(uuid())
      const response = await server.inject(request)
      expect(response.statusCode).to.equal(200)
    })
  })
})
