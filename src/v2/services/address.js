'use strict';

const addressValidator = require('../modules/addresses/validator');
const addressRepo = require('../connectors/repository/addresses');
const { EntityValidationError } = require('../lib/errors');

const createAddress = async address => {
  const { error, value: validatedAddress } = addressValidator.validate(address);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new EntityValidationError('Address not valid', details);
  }

  return addressRepo.create(validatedAddress);
};

const getAddress = async addressId => {
  const result = await addressRepo.findOne(addressId);
  return result;
};

exports.createAddress = createAddress;
exports.getAddress = getAddress;
