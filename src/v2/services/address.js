'use strict';

const addressValidator = require('../modules/addresses/validator');
const addressRepo = require('../connectors/repository/addresses');
const { EntityValidationError } = require('../lib/errors');

const mapValidatedAddress = address => {
  const { addressLine1, addressLine2, addressLine3, addressLine4, ...rest } = address;
  return {
    ...rest,
    address1: addressLine1,
    address2: addressLine2,
    address3: addressLine3,
    address4: addressLine4
  };
};

const createAddress = async address => {
  const { error, value: validatedAddress } = addressValidator.validate(address);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new EntityValidationError('Address not valid', details);
  }

  return addressRepo.create(mapValidatedAddress(validatedAddress));
};

const getAddress = addressId => addressRepo.findOne(addressId);

const deleteAddress = addressId => addressRepo.deleteOne(addressId);

exports.createAddress = createAddress;
exports.getAddress = getAddress;
exports.deleteAddress = deleteAddress;
