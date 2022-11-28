const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sinon = require('sinon')
const sandbox = sinon.createSandbox()

const controller = require('../../../../src/v2/modules/addresses/controller')
const addressService = require('../../../../src/v2/services/address')
const { UniqueConstraintViolation } = require('../../../../src/v2/lib/errors')

const addressData = {
  addressId: 'test-address-id',
  address1: 'Testing House',
  address2: 'Test Square',
  town: 'Testington',
  county: 'Testingshire',
  country: 'United Kingdom',
  postcode: 'TT1 1TT',
  isTest: true,
  uprn: 123456
}

experiment('v2/modules/addresses/controller', () => {
  let h, responseStub
  beforeEach(async () => {
    responseStub = {
      created: sandbox.spy(),
      code: sandbox.spy()
    }

    h = {
      response: sandbox.stub().returns(responseStub)
    }

    sandbox.stub(addressService, 'createAddress')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('.postAddress', () => {
    let payload
    experiment('when the address is created without issue', () => {
      beforeEach(async () => {
        payload = { ...addressData }
        delete payload.addressId

        const request = { payload, method: 'post' }

        addressService.createAddress.resolves(addressData)
        await controller.postAddress(request, h)
      })

      test('calls address service to create a new address record', async () => {
        expect(addressService.createAddress.calledWith(
          payload
        )).to.be.true()
      })

      test('the response header contains the new entity', async () => {
        expect(h.response.calledWith(
          addressData
        )).to.be.true()
      })

      test('the location header points to the saved entity', async () => {
        const [location] = responseStub.created.lastCall.args
        expect(location).to.equal('/crm/2.0/addresses/test-address-id')
      })
    })

    experiment('when a record with that uprn already exists', () => {
      const ERROR = new UniqueConstraintViolation('Message', addressData)
      let result

      beforeEach(async () => {
        payload = { ...addressData }
        delete payload.id
        const request = { payload, method: 'post' }

        addressService.createAddress.rejects(ERROR)
        result = await controller.postAddress(request, h)
      })

      test('the response is a Boom error', async () => {
        expect(result.isBoom).to.be.true()
      })

      test('the response contains the existing entity', async () => {
        expect(result.output.payload.existingEntity).to.equal(addressData)
      })

      test('the response header contains the expected error message', async () => {
        expect(result.message).to.equal(ERROR.message)
      })

      test('the Boom error has a 409 conflict status code', async () => {
        expect(result.output.statusCode).to.equal(409)
      })
    })
  })
})
