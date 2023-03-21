'use strict'

/**
 * Determines the next available invoice account number for the selected region
 * @module InvoiceAccountNumber
 */

const { bookshelf } = require('../../v2/connectors/bookshelf/index.js')

const CHECKLIST_SIZE = 1000

/**
 * Determines the next available invoice account number for a region
 *
 * Prior to this service the invoice account number was determined by finding the current 'largest' number and adding
 * 1 to it. But invoice account numbers have to be in a specific format
 *
 * - [Region][Number padded with 0's to 8 characters][A]
 *
 * For example, B00004378A. We hit a problem in that the Midland's region for reasons we don't know generated
 * B99999999A. This meant the old logic would extract that number, add 1 and return B100000000A. This blew up all the
 * validators throughout tactical-crm and the others. We can't change the format but we did spot massive ranges of
 * unused account numbers across all the regions.
 *
 * So, this service was built to replace the old logic. Now we build up a list of 1000 account numbers to check. We
 * query the DB for any that match. If the number of results is less than 1000 we search for the first check account
 * number that is not in the DB results and return that.
 *
 * But if the DB returns 1000 results, we know that range is full so we move onto the next one.
 *
 * @param {String} region the region code for the region to determine the invoice account number for
 *
 * @returns {String} next available invoice account number
 */
async function generate (region) {
  let start = 1
  let invoiceAccountNumber

  // We use a do-while because we always need to run at least one iteration of this loop
  do {
    const checklist = _generateChecklist(region, start)
    const existingMatches = await _findExistingMatches(checklist)

    // If the db returns the same number of results as is in our checklist then that means there are no available gaps.
    // So, we move onto checking the next range of invoice account numbers
    if (existingMatches.length < checklist.length) {
      invoiceAccountNumber = _findFirstAvailable(checklist, existingMatches)
    }
    start += CHECKLIST_SIZE
  } while (!invoiceAccountNumber)

  return invoiceAccountNumber
}

function _generateChecklist (region, start) {
  // NOTE: Array.from() creates a new, shallow-copied Array instance from an iterable or array-like object. To count
  // as an array-like object it just needs to have a `length:` property. So, our first arg is our array-like object.
  // It then allows you to pass in a map() function. If you do Array.from() will pass every item in the array to the
  // function and use it's result to populate the array instead.
  //
  // This is what is happening with the second part. We get the value (which is undefined so ignored) and the index and
  // we build a check invoice account number from it.
  return Array.from({ length: CHECKLIST_SIZE }, (_value, i) => {
    const paddedNumber = (i + start).toString().padStart(8, '0')

    return `${region}${paddedNumber}A`
  })
}

function _findFirstAvailable (checklist, existingMatches) {
  // Iterate through our checklist
  for (const checkAccountNumber of checklist) {
    // For each item in the checklist see if existingMatches contains it. indexOf() will return -1 if it cannot find
    // the value. For us that means we have our invoice account number that does not currently exist so immediately
    // return it
    if (existingMatches.indexOf(checkAccountNumber) === -1) {
      return checkAccountNumber
    }
  }
}

async function _findExistingMatches (checklist) {
  // NOTE: pluck() instead of select() means the result we get back for each row is just the value, rather than an
  // object that has the property `invoice_account_number:` and the value
  const rows = await bookshelf.knex
    .pluck('invoice_account_number')
    .from('crm_v2.invoice_accounts')
    .whereIn('invoice_account_number', checklist)

  return rows
}

module.exports = {
  generate
}
