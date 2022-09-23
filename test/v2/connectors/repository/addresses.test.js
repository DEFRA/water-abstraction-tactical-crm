'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()

const addressesRepo = require('../../../../src/v2/connectors/repository/addresses')
const Address = require('../../../../src/v2/connectors/bookshelf/Address')
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers')

experiment('v2/connectors/repository/addresses', () => {
  let stub, model

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ id: 'test-id' })
    }

    stub = {
      save: sandbox.stub().resolves(model),
      where: sandbox.stub().returnsThis(),
      fetch: sandbox.stub().resolves(model),
      fetchAll: sandbox.stub().resolves(model)
    }

    sandbox.stub(Address, 'forge').returns(stub)
    sandbox.stub(repoHelpers, 'deleteTestData')
    sandbox.stub(repoHelpers, 'deleteOne')
    sandbox.stub(repoHelpers, 'findOne')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('.create', () => {
    let result
    let address

    beforeEach(async () => {
      address = { address1: 'test one', postcode: 'BS1 1SB' }
      result = await addressesRepo.create(address)
    })

    test('.forge() is called on the model with the data', async () => {
      const [data] = Address.forge.lastCall.args
      expect(data).to.equal(address)
    })

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true)
    })

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true()
      expect(result.id).to.equal('test-id')
    })
  })

  experiment('.findOne', () => {
    beforeEach(async () => {
      await addressesRepo.findOne('test-id')
    })

    test('uses the .findOne helper', async () => {
      expect(repoHelpers.findOne.calledWith(
        Address, 'addressId', 'test-id'
      )).to.be.true()
    })
  })

  experiment('.deleteOne', () => {
    test('uses the repository helpers deleteOne function', async () => {
      await addressesRepo.deleteOne('test-address-id')

      const [model, idKey, id] = repoHelpers.deleteOne.lastCall.args
      expect(model).to.equal(Address)
      expect(idKey).to.equal('addressId')
      expect(id).to.equal('test-address-id')
    })
  })

  experiment('.deleteTestData', () => {
    test('is deleted using the helpers', async () => {
      await addressesRepo.deleteTestData()

      const [model] = repoHelpers.deleteTestData.lastCall.args
      expect(model).to.equal(Address)
    })
  })

  experiment('.findOneWithCompanies', () => {
    beforeEach(async () => {
      await addressesRepo.findOneWithCompanies('test-id')
    })

    test('is created using the helpers', async () => {
      const [model, field, id, related] = repoHelpers.findOne.lastCall.args
      expect(model).to.equal(Address)
      expect(field).to.equal('addressId')
      expect(id).to.equal('test-id')
      expect(related).to.equal(['companyAddresses'])
    })
  })

  experiment('.findOneByUprn', () => {
    beforeEach(async () => {
      await addressesRepo.findOneByUprn(123456)
    })

    test('uses the .findOne helper', async () => {
      expect(repoHelpers.findOne.calledWith(
        Address, 'uprn', 123456
      )).to.be.true()
    })
  })
})
