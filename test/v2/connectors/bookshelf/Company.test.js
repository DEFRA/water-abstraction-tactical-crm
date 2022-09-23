const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const Company = require('../../../../src/v2/connectors/bookshelf/Company')

experiment('v2/connectors/bookshelf/Company', () => {
  let instance

  beforeEach(async () => {
    instance = Company.forge()
    sandbox.stub(instance, 'hasMany')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  test('uses the companies table', async () => {
    expect(instance.tableName).to.equal('crm_v2.companies')
  })

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('company_id')
  })

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated'])
  })

  experiment('the .invoiceAccounts() relation', () => {
    beforeEach(async () => {
      instance.invoiceAccounts()
    })

    test('is a function', async () => {
      expect(instance.invoiceAccounts).to.be.a.function()
    })

    test('calls .hasMany with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasMany.lastCall.args
      expect(model).to.equal('InvoiceAccount')
      expect(foreignKey).to.equal('company_id')
      expect(foreignKeyTarget).to.equal('company_id')
    })
  })
})
