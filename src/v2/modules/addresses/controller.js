'use strict';

const addressService = require('../../services/address');

exports.postAddress = async (request, h) => {
  const addressData = request.payload;
  const { error, address } = await addressService.createAddress(addressData);

  return error
    ? h.response(error).code(422)
    : h.response(address).created(`/crm/2.0/addresses/${address.addressId}`);
};

exports.getAddress = async request => {
  const { addressId } = request.params;
  const address = await addressService.getAddress(addressId);
  return address;
};
