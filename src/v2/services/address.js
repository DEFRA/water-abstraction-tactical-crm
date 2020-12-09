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

/**
 * Tries to create a new address, returns address
 * or error if is uprn duplication issue
 * @param {Object} address
 * @return {Object} {address} if found
 * @return {Object} {error} if uprn duplication error
 */
const createAddress = async address => {
  const { error, value: validatedAddress } = addressValidator.validate(address);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new EntityValidationError('Address not valid', details);
  }

  try {
    const createdAddress = await addressRepo.create(mapValidatedAddress(validatedAddress));
    return { address: createdAddress };
  } catch (err) {
    // unique violation
    if (err.code === '23505' && err.detail.includes('uprn')) {
      return { error: err };
    }
    throw err;
  }
};

const getAddress = addressId => addressRepo.findOne(addressId);

const deleteAddress = addressId => addressRepo.deleteOne(addressId);

const getAddressByUprn = async uprn => {
  const [address] = await addressRepo.findByUprn(uprn);
  return address;
};

exports.createAddress = createAddress;
exports.getAddress = getAddress;
exports.deleteAddress = deleteAddress;
exports.getAddressByUprn = getAddressByUprn;
