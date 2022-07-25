const { experiment, test, beforeEach } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const mappers = require('../../../../src/v2/services/lib/mappers')

experiment('src/v2/services/lib/mappers', () => {
  experiment('.mapDocumentRole', () => {
    let result

    experiment('for a non-billing role', () => {
      beforeEach(async () => {
        const row = {
          documentRoleId: 'test-id',
          role: {
            name: 'testRole'
          }
        }
        result = mappers.mapDocumentRole(row)
      })

      test('includes a roleName property for backwards compatibility', async () => {
        const keys = Object.keys(result)
        expect(keys).to.only.include([
          'documentRoleId',
          'role',
          'roleName'
        ])
      })

      test('document role name', async () => {
        expect(result.roleName).to.equal('testRole')
      })
    })
  })
})
