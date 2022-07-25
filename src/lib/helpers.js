// Contains generic functions unrelated to a specific component

/**
 * Generates a pseudo-random alphanumeric string of the specified length
 * (default 5)
 * @see {@link http://fiznool.com/blog/2014/11/16/short-id-generation-in-javascript/}
 * @param {Number} length - the length of the random code
 * @return {String} - the random code
 */
function createShortCode (length = 5) {
  const alphabet = '23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return str
}

module.exports = {
  createShortCode
}
