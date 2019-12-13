const { mapKeys, camelCase } = require('lodash');

const camelCaseKeys = obj => mapKeys(obj, (value, key) => camelCase(key));

module.exports = camelCaseKeys;
