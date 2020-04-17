const Joi = require('@hapi/joi');

exports.GUID = Joi.string().uuid().required();
exports.TEST_FLAG = Joi.boolean().optional().default(false);
exports.DEFAULT_FLAG = Joi.boolean().optional().default(false);
exports.START_DATE = Joi.date().iso().required();
exports.END_DATE = Joi.date().iso().min(Joi.ref('startDate')).optional().default(null).allow(null);
