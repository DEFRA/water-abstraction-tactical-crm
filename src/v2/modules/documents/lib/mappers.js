const { mapKeys, pick } = require('lodash');
const camelCase = require('camelcase');

const camelCaseKeys = obj => mapKeys(obj, (value, key) => camelCase(key));

const mapEntity = (row, fields) => {
  const [primaryKey] = fields;
  return row[primaryKey] === null
    ? null
    : camelCaseKeys(pick(row, fields));
};

const mapDocumentRole = row => ({
  ...mapEntity(row, ['document_role_id', 'role_id', 'role_name', 'start_date', 'end_date']),
  company: mapEntity(row, ['company_id', 'name', 'company_number']),
  contact: mapEntity(row, ['contact_id', 'salutation', 'first_name', 'last_name', 'middle_names']),
  address: mapEntity(row, ['address_id', 'address_1', 'address_2', 'address_3', 'address_4', 'town', 'county', 'postcode', 'country']),
  invoiceAccount: mapEntity(row, ['invoice_account_id', 'ias_account_number'])
});

exports.camelCaseKeys = camelCaseKeys;
exports.mapEntity = mapEntity;
exports.mapDocumentRole = mapDocumentRole;
