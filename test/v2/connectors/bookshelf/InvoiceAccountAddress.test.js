const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const InvoiceAccountAddress = require('../../../../src/v2/connectors/bookshelf/InvoiceAccountAddress')

experiment('v2/connectors/bookshelf/InvoiceAccountAddress', () => {
  let instance

  beforeEach(async () => {
    instance = InvoiceAccountAddress.forge()
    sandbox.stub(instance, 'hasOne')
    sandbox.stub(instance, 'belongsTo')
  })

  test('uses the address table', async () => {
    expect(instance.tableName).to.equal('crm_v2.invoice_account_addresses')
  })

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('invoice_account_address_id')
  })

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated'])
  })

  experiment('the .address() relation', () => {
    beforeEach(async () => {
      instance.address()
    })

    test('is a function', async () => {
      expect(instance.address).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Address')
      expect(foreignKey).to.equal('address_id')
      expect(foreignKeyTarget).to.equal('address_id')
    })
  })

  experiment('the .invoiceAccount() relation', () => {
    beforeEach(async () => {
      instance.invoiceAccount()
    })

    test('is a function', async () => {
      expect(instance.invoiceAccount).to.be.a.function()
    })

    test('calls .belongsTo with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.belongsTo.lastCall.args
      expect(model).to.equal('InvoiceAccount')
      expect(foreignKey).to.equal('invoice_account_id')
      expect(foreignKeyTarget).to.equal('invoice_account_id')
    })
  })

  experiment('the .agentCompany() relation', () => {
    beforeEach(async () => {
      instance.agentCompany()
    })

    test('is a function', async () => {
      expect(instance.invoiceAccount).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Company')
      expect(foreignKey).to.equal('company_id')
      expect(foreignKeyTarget).to.equal('agent_company_id')
    })
  })

  experiment('the .contact() relation', () => {
    beforeEach(async () => {
      instance.contact()
    })

    test('is a function', async () => {
      expect(instance.invoiceAccount).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Contact')
      expect(foreignKey).to.equal('contact_id')
      expect(foreignKeyTarget).to.equal('contact_id')
    })
  })
})
