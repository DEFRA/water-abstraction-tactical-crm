const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const { omit } = require('lodash');

const controller = require('../../../../src/v2/modules/addresses/controller');
const addressService = require('../../../../src/v2/services/address');

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
};

experiment('v2/modules/addresses/controller', () => {
  let h, responseStub;
  beforeEach(async () => {
    responseStub = {
      created: sandbox.spy(),
      code: sandbox.spy()
    };

    h = {
      response: sandbox.stub().returns(responseStub)
    };

    sandbox.stub(addressService, 'createAddress');
    sandbox.stub(addressService, 'getAddressByUprn').resolves(addressData);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.postAddress', () => {
    let payload;
    experiment('when the address is created without issue', () => {
      beforeEach(async () => {
        payload = omit(addressData, 'addressId');
        const request = { payload };

        addressService.createAddress.resolves({ address: addressData });
        await controller.postAddress(request, h);
      });

      test('calls address service to create a new address record', async () => {
        expect(addressService.createAddress.calledWith(
          payload
        )).to.be.true();
      });

      test('the response header contains the new entity', async () => {
        expect(h.response.calledWith(
          addressData
        )).to.be.true();
      });

      test('the location header points to the saved entity', async () => {
        const [location] = responseStub.created.lastCall.args;
        expect(location).to.equal('/crm/2.0/addresses/test-address-id');
      });
    });

    experiment('when a record with that uprn already exists', () => {
      beforeEach(async () => {
        payload = omit(addressData, 'id');
        const request = { payload };

        addressService.createAddress.resolves({ error: 'oh no!' });
        await controller.postAddress(request, h);
      });

      test('the existing entity is fetched', () => {
        expect(addressService.getAddressByUprn.calledWith(
          123456
        )).to.be.true();
      });

      test('the response header contains the existing entity', async () => {
        const [{ existingEntity }] = h.response.lastCall.args;
        expect(existingEntity).to.equal(addressData);
      });

      test('the response header contains the expected error message', async () => {
        const [{ error }] = h.response.lastCall.args;
        expect(error).to.equal('An address with UPRN of 123456 already exists');
      });

      test('the 409 conflict code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(409);
      });
    });
  });
});
