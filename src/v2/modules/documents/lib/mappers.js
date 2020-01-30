const { mapKeys, pick, camelCase } = require('lodash');
const camelCaseKeys = require('../../../../lib/camel-case-keys');

const stripPrefix = (str, prefix) => camelCase(str.replace(prefix, ''));
const stripKeyPrefix = (obj, prefix) =>
  mapKeys(obj, (value, key) => stripPrefix(key, prefix));

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

const ADDRESS_KEYS = ['address_id', 'address_1', 'address_2', 'address_3', 'address_4', 'town', 'county', 'postcode', 'country'];
const INVOICE_ACCOUNT_ADDRESS_KEYS = [
  'invoice_account_address_id',
  'invoice_account_address_1',
  'invoice_account_address_2',
  'invoice_account_address_3',
  'invoice_account_address_4',
  'invoice_account_town',
  'invoice_account_county',
  'invoice_account_postcode',
  'invoice_account_country'
];

const mapAddress = row => {
  const keys = row.role_name === 'billing' ? INVOICE_ACCOUNT_ADDRESS_KEYS : ADDRESS_KEYS;
  const address = mapEntity(row, keys);
  return address ? stripKeyPrefix(address, 'invoiceAccount') : null;
};

const mapDocumentRole = row => ({
  ...mapEntity(row, ['document_role_id', 'role_id', 'role_name', 'start_date', 'end_date']),
  company: mapCompany(row),
  contact: mapEntity(row, ['contact_id', 'salutation', 'first_name', 'last_name', 'middle_names', 'initials']),
  address: mapAddress(row),
  invoiceAccount: mapEntity(row, ['invoice_account_id', 'invoice_account_number'])
});

exports.mapEntity = mapEntity;
exports.mapDocumentRole = mapDocumentRole;
