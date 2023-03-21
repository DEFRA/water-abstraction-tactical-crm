'use strict'

const { bookshelf } = require('../../v2/connectors/bookshelf/index.js')

const CHECKLIST_SIZE = 1000

async function generate (region) {
  let start = 1
  let invoiceAccountNumber

  do {
    const checklist = _generateChecklist(region, start)
    const existingMatches = await _findExistingMatches(checklist)

    if (existingMatches.length < checklist.length) {
      invoiceAccountNumber = _findFirstAvailable(checklist, existingMatches)
    }
    start += CHECKLIST_SIZE
  } while (!invoiceAccountNumber)

  return invoiceAccountNumber
}

function _generateChecklist (region, start) {
  return Array.from({ length: CHECKLIST_SIZE }, (_value, i) => {
    const paddedNumber = (i + start).toString().padStart(8, '0')

    return `${region}${paddedNumber}A`
  })
}

function _findFirstAvailable (checklist, existingMatches) {
  for (let i = 0; i < checklist.length; i++) {
    if (existingMatches.indexOf(checklist[i]) === -1) {
      return checklist[i]
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
