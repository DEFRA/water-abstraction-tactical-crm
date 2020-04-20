'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const controller = require('../../../../src/v2/modules/addresses/controller');
const addressService = require('../../../../src/v2/services/address');

experiment('modules/adresses/controller', () => {
  let h;
  const hapiResponse = {
    code: sandbox.spy(),
    created: sandbox.spy()
  };

  beforeEach(async () => {
    h = {
      response: sandbox.stub().returns(hapiResponse)
    };

    sandbox.stub(addressService, 'createAddress').callThrough();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.postAddress', () => {
    experiment('for an invalid address', () => {
      let response;

      beforeEach(async () => {
        const request = {
          payload: {
            address1: 'Test Towers',
            town: 'Bristol',
            county: 'Bristol',
            country: 'England',
            postcode: 'I am not a valid postcode'
          }
        };

        response = await controller.postAddress(request, h);
      });

      test('a 422 response is sent because the data is invalid', async () => {
        expect(response.output.payload.statusCode).to.equal(422);
      });

      test('the response contains the validation error details', async () => {
        expect(response.output.payload.message).to.equal('Address not valid');
        expect(response.output.payload.validationDetails).to.be.an.array();
        expect(response.output.payload.validationDetails[0]).to.be.a.string();
      });
    });

    experiment('for a valid address', () => {
      beforeEach(async () => {
        const request = {
          payload: {
            address1: 'Test Towers',
            town: 'Bristol',
            county: 'Bristol',
            country: 'England',
            postcode: 'BS1 1SB'
          }
        };

        addressService.createAddress.resolves({
          addressId: 'test-address-id'
        });

        await controller.postAddress(request, h);
      });

      test('the response contains the new address', async () => {
        const [body] = h.response.lastCall.args;
        expect(body.addressId).to.equal('test-address-id');
      });

      test('returns a 201 response code', async () => {
        const [url] = hapiResponse.created.lastCall.args;
        expect(url).to.equal('/crm/2.0/addresses/test-address-id');
      });
    });
  });
});
