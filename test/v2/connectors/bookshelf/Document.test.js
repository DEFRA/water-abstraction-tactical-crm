const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

const Document = require('../../../../src/v2/connectors/bookshelf/Document')

experiment('v2/connectors/bookshelf/Document', () => {
  let instance

  beforeEach(async () => {
    instance = Document.forge()
  })

  test('uses the documents table', async () => {
    expect(instance.tableName).to.equal('crm_v2.documents')
  })

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('document_id')
  })

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated'])
  })
})
