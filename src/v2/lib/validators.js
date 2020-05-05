const Joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'));

const DATE = Joi.date().format('YYYY-MM-DD');
const GUID = Joi.string().uuid().required();
const TEST_FLAG = Joi.boolean().optional().default(false);
const DEFAULT_FLAG = Joi.boolean().optional().default(false);
const START_DATE = DATE.required();
const END_DATE = DATE.min(Joi.ref('startDate')).optional().default(null).allow(null);
const EMAIL = Joi.string().email().optional().allow(null);
const REGIME = Joi.string().required().valid('water');
const DOC_TYPE = Joi.string().required().valid('abstraction_licence');
const DOC_STATUS = Joi.string().required().valid('current', 'draft', 'superseded');
const VERSION = Joi.number().integer().required().min(0);
const REQUIRED_STRING = Joi.string().required();

exports.DATE = DATE;
exports.GUID = GUID;
exports.TEST_FLAG = TEST_FLAG;
exports.DEFAULT_FLAG = DEFAULT_FLAG;
exports.START_DATE = START_DATE;
exports.END_DATE = END_DATE;
exports.EMAIL = EMAIL;
exports.REGIME = REGIME;
exports.DOC_TYPE = DOC_TYPE;
exports.DOC_STATUS = DOC_STATUS;
exports.VERSION = VERSION;
exports.REQUIRED_STRING = REQUIRED_STRING;
