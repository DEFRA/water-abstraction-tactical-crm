'use strict';

const addressValidator = require('../modules/addresses/validator');
const addressRepo = require('../connectors/repository/addresses');

const createAddress = async address => {
  const { error, value: validatedAddress } = addressValidator.validate(address);

  if (error) {
    return {
      error: {
        message: 'Address not valid',
        details: error.details.map(detail => detail.message)
      }
    };
  }

  try {
    const savedAddress = await addressRepo.create(validatedAddress);
    return { error: null, address: savedAddress };
  } catch (error) {
    return { error };
  }
};

const getAddress = async addressId => {
  const result = await addressRepo.findOne(addressId);
  return result;
};

exports.createAddress = createAddress;
exports.getAddress = getAddress;
