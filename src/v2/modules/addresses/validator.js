'use strict';

const Joi = require('@hapi/joi');
const validators = require('../../lib/validators');

const mandatoryPostcodeCountries = [
  'united kingdom',
  'england',
  'wales',
  'scotland',
  'northern ireland',
  'uk'
];

// https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation
const postcodeRegex = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;

const schema = Joi.object({
  address1: validators.REQUIRED_STRING,
  address2: validators.OPTIONAL_STRING,
  address3: validators.OPTIONAL_STRING,
  address4: validators.OPTIONAL_STRING,
  town: validators.REQUIRED_STRING,
  county: validators.OPTIONAL_STRING,
  country: Joi.string().trim().replace(/\./g, '').required(),
  postcode: Joi.string().trim().empty('').default(null).optional().when('country', {
    is: Joi.string().lowercase().replace(/\./g, '').valid(mandatoryPostcodeCountries),
    then: Joi.string().required()
      // uppercase and remove any spaces (BS1 1SB -> BS11SB)
      .uppercase().replace(/ /g, '')
      // then ensure the space is before the inward code (BS11SB -> BS1 1SB)
      .replace(/(.{3})$/, ' $1').regex(postcodeRegex)
  }),
  isTest: validators.TEST_FLAG,
  uprn: validators.UPRN,
  dataSource: validators.DATA_SOURCE
});

/**
 * Validates that an object conforms to the requirements of an address.
 */
exports.validate = address => Joi.validate(address, schema, { abortEarly: false });
