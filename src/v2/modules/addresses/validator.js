'use strict';

const Joi = require('@hapi/joi');

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
  address1: Joi.string().trim().required(),
  address2: Joi.string().trim().default(null).empty('').optional(),
  address3: Joi.string().trim().default(null).empty('').optional(),
  address4: Joi.string().trim().default(null).empty('').optional(),
  town: Joi.string().trim().required(),
  county: Joi.string().trim().required(),
  country: Joi.string().trim().replace(/\./g, '').required(),
  postcode: Joi.string().trim().empty('').default(null).optional().when('country', {
    is: Joi.string().lowercase().replace(/\./g, '').valid(mandatoryPostcodeCountries),
    then: Joi.string().required()
      // uppercase and remove any spaces (BS1 1SB -> BS11SB)
      .uppercase().replace(/ /g, '')
      // then ensure the space is before the inward code (BS11SB -> BS1 1SB)
      .replace(/(.{3})$/, ' $1').regex(postcodeRegex)
  }),
  isTest: Joi.boolean().optional().default(false)
});

/**
 * Validates that an object conforms to the requirements of an address.
 */
exports.validate = address => Joi.validate(address, schema, { abortEarly: false });
