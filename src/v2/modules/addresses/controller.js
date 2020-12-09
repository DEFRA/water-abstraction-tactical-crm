const addressService = require('../../services/address');

const getExistingEntity = async uprn =>
  addressService.getAddressByUprn(uprn);

const getExistingEntityErrorResponse = async address => {
  const { uprn } = address;
  const existingEntity = await getExistingEntity(uprn);
  return {
    existingEntity,
    error: `An address with UPRN of ${uprn} already exists`
  };
};

const postAddress = async (request, h) => {
  const { payload: address } = request;
  const { address: createdAddress, error } = await addressService.createAddress(address);
  if (error) {
    const errorResponse = await getExistingEntityErrorResponse(address);
    return h.response(errorResponse).code(409);
  }
  return h.response(createdAddress).created(`/crm/2.0/addresses/${createdAddress.addressId}`);
};

exports.postAddress = postAddress;
