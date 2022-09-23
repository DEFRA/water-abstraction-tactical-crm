const Hapi = require('@hapi/hapi')
const { expect } = require('@hapi/code')
const { cloneDeep } = require('lodash')

const {
  beforeEach,
  experiment,
  test
} = exports.lab = require('@hapi/lab').script()

const routes = require('../../src/routes/documents')

experiment('/documents/{documentId}/users', () => {
  let server

  beforeEach(async () => {
    const getDocumentUsersRoute = cloneDeep(routes['/crm/{documentId}/users'])
    getDocumentUsersRoute.handler = () => 'ok'
    server = Hapi.server()
    server.route(getDocumentUsersRoute)
  })

  test('validates the documentId must be a GUID', async () => {
    const url = '/crm/1.0/documents/not-a-guid/users'
    const output = await server.inject(url)
    expect(output.statusCode).to.equal(400)
  })

  test('allows a valid guid for documentId', async () => {
    const url = '/crm/1.0/documents/00000000-0000-0000-0000-000000000000/users'
    const output = await server.inject(url)
    expect(output.statusCode).to.equal(200)
  })
})
