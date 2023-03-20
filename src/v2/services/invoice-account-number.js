'use strict'

const { bookshelf } = require('../../v2/connectors/bookshelf/index.js')

const CHECKLIST_SIZE = 1000

async function generate (region) {
  let start = 1
  let invoiceAccountNumber

  do {
    const checklist = _generateChecklist(region, start)
    const existingMatches = await _findExistingMatches(checklist)

    if (existingMatches.length === 0) {
      invoiceAccountNumber = checklist[0]
    } else if (existingMatches.length < checklist.length) {
      invoiceAccountNumber = _findFirstAvailable(checklist, existingMatches)
    }
    start += CHECKLIST_SIZE
  } while (!invoiceAccountNumber)

  return invoiceAccountNumber
}

function _generateChecklist (region, start) {
  const checklist = [...Array(CHECKLIST_SIZE - start + 1).keys()].map((x) => {
    const paddedNumber = _leftPadZeroes(x + 1, 8)

    return `${region}${paddedNumber}A`
  })

  return checklist
}

function _findFirstAvailable (checklist, existingMatches) {
  let firstNonMatch

  for (let cx = 0; cx < checklist.length; cx++) {
    const found = existingMatches.find((existingMatch) => {
      return existingMatch === checklist[cx]
    })

    if (!found) {
      firstNonMatch = checklist[cx]
      break
    }
  }

  return firstNonMatch
}

async function _findExistingMatches (checklist) {
  let checklistAsArg = ''
  for (const item of checklist) {
    checklistAsArg = `${checklistAsArg},'${item}'`
  }
  checklistAsArg = checklistAsArg.slice(1)

  const query = `SELECT ia.invoice_account_number FROM crm_v2.invoice_accounts ia WHERE ia.invoice_account_number IN (${checklistAsArg})`
  const { rows } = await bookshelf.knex.raw(query)

  const mappedRows = rows.map((row) => {
    return row.invoice_account_number
  })

  return mappedRows
}

/**
 * Pads a number to a given length with leading zeroes and returns the result as a string
 *
 * @param {Number} number The number to be padded
 * @param {Number} length How many characters in length the final string should be
 *
 * @returns {string} The number padded with zeros to the specified length
 */
function _leftPadZeroes (number, length) {
  return number
    .toString()
    .padStart(length, '0')
}

module.exports = {
  generate
}
