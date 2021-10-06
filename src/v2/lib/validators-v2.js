const Joi = require('joi').extend(require('@joi/date'));

const nullDefault = val => {
  if (val === 'undefined') {
    return val;
  }
  return null;
};

const falseDefault = val => {
  // Note: could be an object
  if (val === 'undefined') {
    return val;
  }
  return false;
};

const OPTIONAL_STRING = Joi.string().allow('', null).trim().empty('').default(nullDefault);
const REQUIRED_STRING = Joi.string().trim().required();
const TEST_FLAG = Joi.boolean().optional().default(falseDefault);
const DATA_SOURCE = Joi.string().valid('wrls', 'nald').default('wrls');

const DATE = Joi.date().format('YYYY-MM-DD');
const GUID = Joi.string().uuid().required();
const DEFAULT_FLAG = Joi.boolean().optional().default(false);
const START_DATE = DATE.required();
const END_DATE = DATE.min(Joi.ref('startDate')).optional().default(null).allow(null);
const EMAIL = Joi.string().email().optional().allow(null);
const REGIME = Joi.string().required().valid('water');
const DOC_TYPE = Joi.string().required().valid('abstraction_licence');
const INVOICE_ACCOUNT_NUMBER = Joi.string().regex(/^[ABENSTWY][0-9]{8}A$/);
const REQUIRED_INVOICE_ACCOUNT_NUMBER = Joi.string().regex(/^[ABENSTWY][0-9]{8}A$/).required();
const REGION_CODE = Joi.string().regex(/^[ABENSTWY]$/);
const ADDRESS_DATA_SOURCE = Joi.string().valid('wrls', 'nald', 'ea-address-facade', 'companies-house').default('wrls');
const UPRN = Joi.number().integer().min(0).default(null).allow(null);
const OPTIONAL_STRING_NO_DEFAULT_VALUE = Joi.string().allow('', null).trim().empty('');
const CONTACT_TYPE = Joi.string().required().valid('person', 'department');
const ROLE_NAMES = Joi.string().required().valid('licenceHolder', 'billing');
const NULLABLE_DATE = DATE.required().allow(null);

exports.DATE = DATE;
exports.GUID = GUID;
exports.TEST_FLAG = TEST_FLAG;
exports.DEFAULT_FLAG = DEFAULT_FLAG;
exports.START_DATE = START_DATE;
exports.END_DATE = END_DATE;
exports.EMAIL = EMAIL;
exports.REGIME = REGIME;
exports.DOC_TYPE = DOC_TYPE;
exports.REQUIRED_STRING = REQUIRED_STRING;
exports.INVOICE_ACCOUNT_NUMBER = INVOICE_ACCOUNT_NUMBER;
exports.REQUIRED_INVOICE_ACCOUNT_NUMBER = REQUIRED_INVOICE_ACCOUNT_NUMBER;
exports.REGION_CODE = REGION_CODE;
exports.DATA_SOURCE = DATA_SOURCE;
exports.ADDRESS_DATA_SOURCE = ADDRESS_DATA_SOURCE;
exports.UPRN = UPRN;
exports.OPTIONAL_STRING = OPTIONAL_STRING;
exports.OPTIONAL_STRING_NO_DEFAULT_VALUE = OPTIONAL_STRING_NO_DEFAULT_VALUE;
exports.CONTACT_TYPE = CONTACT_TYPE;
exports.ROLE_NAMES = ROLE_NAMES;
exports.NULLABLE_DATE = NULLABLE_DATE;
