/**
 * Test verification process
 * - Create entity
 * - Create company
 * - Create unverified document headers linked to entity/company
 * - Create verification code - update documents with ID
 * - Verify with auth code
 */
'use strict'
const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()

const Code = require('@hapi/code')
const server = require('../../index')

const { v4: uuid } = require('uuid')

const { createEntity, deleteEntity, createEntityRole, deleteEntityRole, makeRequest } = require('../helpers')

let regimeEntityId = null
let individualEntityId = null
let granteeEntityId = null
let companyEntityId = null
let roleId = null
let granteeRoleId = null

lab.experiment('Test grant/delete colleague roles', () => {
  // Create regime
  lab.before(async () => {
    await server._start()

    {
      const { entity_id: entityId } = await makeRequest(server, createEntity, 'regime')
      regimeEntityId = entityId
    }
    {
      const { entity_id: entityId } = await makeRequest(server, createEntity, 'company')
      companyEntityId = entityId
    }
    {
      const { entity_id: entityId } = await makeRequest(server, createEntity, 'individual')
      individualEntityId = entityId
    }
    {
      const { entity_id: entityId } = await makeRequest(server, createEntity, 'individual')
      granteeEntityId = entityId
    }

    // Grant primary user role for company
    const { entity_role_id: entityRoleId } = await makeRequest(server, createEntityRole, regimeEntityId, companyEntityId, individualEntityId, 'primary_user')
    roleId = entityRoleId
  })

  lab.after(async () => {
    // Delete all temporary entities
    const entityIds = [regimeEntityId, individualEntityId, companyEntityId, granteeEntityId]
    const tasks = entityIds.map(entityId => deleteEntity(entityId))
    await Promise.all(tasks)
    await makeRequest(server, deleteEntityRole, individualEntityId, roleId)
    await makeRequest(server, deleteEntityRole, granteeEntityId, granteeRoleId)
  })

  lab.test('The API should grant access to a user when valid request supplied', async () => {
    const request = {
      method: 'POST',
      url: `/crm/1.0/entity/${individualEntityId}/colleagues`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        colleagueEntityID: granteeEntityId,
        role: 'user'
      }
    }

    const res = await server.inject(request)
    Code.expect(res.statusCode).to.equal(201)

    // Check payload
    const payload = JSON.parse(res.payload)
    Code.expect(payload.data.entity_role_id).to.have.length(36)
    Code.expect(payload.data.entity_id).to.equal(granteeEntityId)
    Code.expect(payload.data.company_entity_id).to.equal(companyEntityId)
    Code.expect(payload.data.regime_entity_id).to.equal(regimeEntityId)
    Code.expect(payload.data.role).to.equal('user')

    granteeRoleId = payload.data.entity_role_id
  })

  lab.test('A user without primary_user role should not be able to grant access', async () => {
    const request = {
      method: 'POST',
      url: `/crm/1.0/entity/${granteeEntityId}/colleagues`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        colleagueEntityID: individualEntityId,
        role: 'user'
      }
    }

    const res = await server.inject(request)
    Code.expect(res.statusCode).to.equal(401)
  })

  lab.test('The API should remove a colleague role', async () => {
    const request = {
      method: 'DELETE',
      url: `/crm/1.0/entity/${individualEntityId}/colleagues/${granteeRoleId}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    }

    const res = await server.inject(request)
    Code.expect(res.statusCode).to.equal(200)

    const payload = JSON.parse(res.payload)

    Code.expect(payload.data.entity_role_id).to.equal(granteeRoleId)
  })

  lab.test('The API should return 404 for role not found when deleting colleague', async () => {
    const request = {
      method: 'DELETE',
      url: `/crm/1.0/entity/${individualEntityId}/colleagues/${uuid()}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    }

    const res = await server.inject(request)
    Code.expect(res.statusCode).to.equal(404)
  })
})
