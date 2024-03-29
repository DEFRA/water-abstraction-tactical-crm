'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const companyAddressesRepo = require('../../../../src/v2/connectors/repository/company-addresses')
const CompanyAddress = require('../../../../src/v2/connectors/bookshelf/CompanyAddress')
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers')

experiment('v2/connectors/repository/company-addresses', () => {
  let stub, model

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ companyAddressId: 'test-id' })
    }

    stub = {
      save: sandbox.stub().resolves(model),
      fetch: sandbox.stub().resolves(model),
      where: sandbox.stub().returnsThis()
    }

    sandbox.stub(CompanyAddress, 'forge').returns(stub)
    sandbox.stub(CompanyAddress, 'collection').returns(stub)

    sandbox.stub(repoHelpers, 'deleteTestData')
    sandbox.stub(repoHelpers, 'deleteOne')
    sandbox.stub(repoHelpers, 'findOneBy')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('.create', () => {
    let result
    let companyAddress

    beforeEach(async () => {
      companyAddress = {
        companyId: 'company-id',
        addressId: 'address-id',
        roleId: 'role-id',
        startDate: '2019-01-01',
        endDate: null
      }
      result = await companyAddressesRepo.create(companyAddress)
    })

    test('.forge() is called on the model with the data', async () => {
      const [data] = CompanyAddress.forge.lastCall.args
      expect(data).to.equal(companyAddress)
    })

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true)
    })

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true()
      expect(result.companyAddressId).to.equal('test-id')
    })
  })

  experiment('.deleteOne', () => {
    test('uses the repository helpers deleteOne function', async () => {
      await companyAddressesRepo.deleteOne('test-company-address-id')

      const [model, idKey, id] = repoHelpers.deleteOne.lastCall.args
      expect(model).to.equal(CompanyAddress)
      expect(idKey).to.equal('companyAddressId')
      expect(id).to.equal('test-company-address-id')
    })
  })

  experiment('.deleteTestData', () => {
    test('is deleted using the helpers', async () => {
      await companyAddressesRepo.deleteTestData()

      const [model] = repoHelpers.deleteTestData.lastCall.args
      expect(model).to.equal(CompanyAddress)
    })
  })

  experiment('.findManyByCompanyId', () => {
    const companyId = 'company-id'

    beforeEach(async () => {
      await companyAddressesRepo.findManyByCompanyId(companyId)
    })

    test('.collection() is called on the model', async () => {
      expect(CompanyAddress.collection.called).to.be.true()
    })

    test('.where() is called to get company addresses by company ID', async () => {
      expect(stub.where.calledWith(
        'company_id', companyId
      )).to.be.true()
    })

    test('.fetch() is callled with related addresses', async () => {
      expect(stub.fetch.calledWith({
        withRelated: [
          'address',
          'role'
        ]
      })).to.be.true()
    })

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true()
    })
  })

  experiment('.findOneByCompanyAddressAndRoleId', () => {
    const companyId = 'company-id'
    const addressId = 'address-id'
    const roleId = 'role-id'

    beforeEach(async () => {
      await companyAddressesRepo.findOneByCompanyAddressAndRoleId(companyId, addressId, roleId)
    })

    test('delegates to .findOneBy() repo helper', async () => {
      expect(repoHelpers.findOneBy.calledWith(
        CompanyAddress,
        {
          companyId,
          addressId,
          roleId
        }
      )).to.be.true()
    })
  })
})
