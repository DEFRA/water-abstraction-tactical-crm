const deepMapKeys = require('deep-map-keys')

/**
 * Camel cases the keys of an object, or an array of objects.
 * @param {Array|Object} data The array of objects, or object that is to
 * have it's keys camel cased
 */
const camelCaseKeys = data => {
  return deepMapKeys(data, toCamelCase)
}
/* This regex is converting any string into Camel Case
 * [^a-zA-Z0-9] Is the first part and it is matching any character except those inside
 * the square brackets. This could be a dash (-), space ( ), or underscore (_)
 * The next part of the regex +(.) is matching the first character after the dash, space or underscore.
 * The last part is the /g. This replaces all the global matches and not just the first match, so the whole string can be converted
*/

function toCamelCase (key) {
  key.toLowerCase()
  return key.replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
}

module.exports = camelCaseKeys
