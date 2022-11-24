const deepMapKeys = require('deep-map-keys')

/**
 * Camel cases the keys of an object, or an array of objects.
 * @param {Array|Object} data The array of objects, or object that is to
 * have it's keys camel cased
 */
const camelCaseKeys = data => {
  return deepMapKeys(data, toCamelCase)
}

function toCamelCase (key) {
  key.toLowerCase()
  return key.replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
}

module.exports = camelCaseKeys
