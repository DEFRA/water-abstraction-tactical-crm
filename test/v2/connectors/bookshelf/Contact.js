const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

const Address = require('../../../../src/v2/connectors/bookshelf/Contact')

experiment('v2/connectors/bookshelf/Contact', () => {
  let instance

  beforeEach(async () => {
    instance = Address.forge()
  })

  test('uses the contacts table', async () => {
    expect(instance.tableName).to.equal('crm_v2.contacts')
  })

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('contact_id')
  })

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated'])
  })

  test('has a companyContacts relationship', async () => {
    expect(instance.companyContacts).to.be.a.function()
  })
})
