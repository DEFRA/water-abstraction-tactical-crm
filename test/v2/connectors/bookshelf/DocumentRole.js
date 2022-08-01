const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

const DocumentRole = require('../../../../src/v2/connectors/bookshelf/DocumentRole')
const sandbox = require('sinon').createSandbox()

experiment('v2/connectors/bookshelf/DocumentRole', () => {
  let instance

  beforeEach(async () => {
    instance = new DocumentRole()
    sandbox.stub(instance, 'hasOne')
  })

  test('uses the document_roles table', async () => {
    expect(instance.tableName).to.equal('crm_v2.document_roles')
  })

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('document_role_id')
  })

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated'])
  })

  experiment('the .role() relation', () => {
    beforeEach(async () => {
      instance.role()
    })

    test('is a function', async () => {
      expect(instance.role).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Role')
      expect(foreignKey).to.equal('role_id')
      expect(foreignKeyTarget).to.equal('role_id')
    })
  })

  experiment('the .document() relation', () => {
    beforeEach(async () => {
      instance.document()
    })

    test('is a function', async () => {
      expect(instance.document).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Document')
      expect(foreignKey).to.equal('document_id')
      expect(foreignKeyTarget).to.equal('document_id')
    })
  })

  experiment('the .company() relation', () => {
    beforeEach(async () => {
      instance.company()
    })

    test('is a function', async () => {
      expect(instance.company).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Company')
      expect(foreignKey).to.equal('company_id')
      expect(foreignKeyTarget).to.equal('company_id')
    })
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

  experiment('the .contact() relation', () => {
    beforeEach(async () => {
      instance.contact()
    })

    test('is a function', async () => {
      expect(instance.contact).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Contact')
      expect(foreignKey).to.equal('contact_id')
      expect(foreignKeyTarget).to.equal('contact_id')
    })
  })

  experiment('the .invoiceAccount() relation', () => {
    beforeEach(async () => {
      instance.invoiceAccount()
    })

    test('is a function', async () => {
      expect(instance.invoiceAccount).to.be.a.function()
    })

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('InvoiceAccount')
      expect(foreignKey).to.equal('invoice_account_id')
      expect(foreignKeyTarget).to.equal('invoice_account_id')
    })
  })
})
