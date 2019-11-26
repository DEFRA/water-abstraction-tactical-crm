const { mapKeys, pick } = require('lodash');
const camelCase = require('camelcase');

const camelCaseKeys = obj => mapKeys(obj, (value, key) => camelCase(key));

const mapEntity = (row, fields) => {
  const [primaryKey] = fields;
  return row[primaryKey] === null
    ? null
    : camelCaseKeys(pick(row, fields));
};

/**
 * Maps a row retrieved from the DB to a company
 * For billing role, this is the company linked to the invoice account
 * @param {Object} row - the DB row
 * @return {Object} company
 */
const mapCompany = row => {
  if (row.role_name === 'billing') {
    return {
      companyId: row.invoice_company_id,
      name: row.invoice_company_name,
      companyNumber: row.invoice_company_number
    };
  }
  return mapEntity(row, ['company_id', 'name', 'company_number']);
};

const mapDocumentRole = row => ({
  ...mapEntity(row, ['document_role_id', 'role_id', 'role_name', 'start_date', 'end_date']),
  company: mapCompany(row),
  contact: mapEntity(row, ['contact_id', 'salutation', 'first_name', 'last_name', 'middle_names']),
  address: mapEntity(row, ['address_id', 'address_1', 'address_2', 'address_3', 'address_4', 'town', 'county', 'postcode', 'country']),
  invoiceAccount: mapEntity(row, ['invoice_account_id', 'invoice_account_number'])
});

exports.camelCaseKeys = camelCaseKeys;
exports.mapEntity = mapEntity;
exports.mapDocumentRole = mapDocumentRole;
