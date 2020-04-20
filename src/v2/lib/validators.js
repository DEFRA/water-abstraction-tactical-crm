const Joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'));

const DATE = Joi.date().format('YYYY-MM-DD');
const GUID = Joi.string().uuid().required();
const TEST_FLAG = Joi.boolean().optional().default(false);
const DEFAULT_FLAG = Joi.boolean().optional().default(false);
const START_DATE = DATE.required();
const END_DATE = DATE.min(Joi.ref('startDate')).optional().default(null).allow(null);
const EMAIL = Joi.string().email().optional().allow(null);

exports.DATE = DATE;
exports.GUID = GUID;
exports.TEST_FLAG = TEST_FLAG;
exports.DEFAULT_FLAG = DEFAULT_FLAG;
exports.START_DATE = START_DATE;
exports.END_DATE = END_DATE;
exports.EMAIL = EMAIL;
