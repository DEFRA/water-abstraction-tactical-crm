'use strict';

const addressService = require('../../services/address');
const mapErrorResponse = require('../../lib/map-error-response');

exports.postAddress = async (request, h) => {
  const addressData = request.payload;

  try {
    const address = await addressService.createAddress(addressData);
    return h.response(address).created(`/crm/2.0/addresses/${address.addressId}`);
  } catch (error) {
    return mapErrorResponse(error);
  }
};

exports.getAddress = async request => {
  const { addressId } = request.params;
  const address = await addressService.getAddress(addressId);
  return address;
};
