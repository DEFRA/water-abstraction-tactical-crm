const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const CompanyAddress = require('../../../../src/v2/connectors/bookshelf/CompanyAddress')

experiment('v2/connectors/bookshelf/CompanyAddress', () => {
  let instance

  beforeEach(async () => {
    instance = CompanyAddress.forge()
    sandbox.stub(instance, 'hasOne')
    sandbox.stub(instance, 'belongsTo')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  test('uses the company_addresses table', async () => {
    expect(instance.tableName).to.equal('crm_v2.company_addresses')
  })

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('company_address_id')
  })

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated'])
  })

  experiment('the .company() relation', () => {
    beforeEach(async () => {
      instance.company()
    })

    test('is a function', async () => {
      expect(instance.company).to.be.a.function()
    })

    test('calls .belongsTo with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.belongsTo.lastCall.args
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

    test('calls .belongsTo with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Address')
      expect(foreignKey).to.equal('address_id')
      expect(foreignKeyTarget).to.equal('address_id')
    })
  })

  experiment('the .role() relation', () => {
    beforeEach(async () => {
      instance.role()
    })

    test('is a function', async () => {
      expect(instance.role).to.be.a.function()
    })

    test('calls .belongsTo with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args
      expect(model).to.equal('Role')
      expect(foreignKey).to.equal('role_id')
      expect(foreignKeyTarget).to.equal('role_id')
    })
  })
})
