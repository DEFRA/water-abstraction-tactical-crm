const { InvoiceAccount } = require('../bookshelf');
const helpers = require('./helpers');

/**
 * Find single InvoiceAccount with relations by ID
 * @param {String} id
 * @return {Promise<Object>}
 */
const findOne = async id => {
  const result = await InvoiceAccount
    .forge({ invoiceAccountId: id })
    .fetch({
      withRelated: [
        'company',
        'invoiceAccountAddresses',
        'invoiceAccountAddresses.address'
      ],
      require: false
    });
  return result ? result.toJSON() : null;
};

/**
 * Find many InvoiceAccounts with relations by IDs
 * @param {Array<String>} ids
 * @return {Promise<Array>}
 */
const findWithCurrentAddress = async ids => {
  const result = await InvoiceAccount
    .collection()
    .where('invoice_account_id', 'in', ids)
    .fetch({
      withRelated: [
        'company',
        {
          invoiceAccountAddresses: qb => qb
            .where('end_date', null)
        },
        'invoiceAccountAddresses.address'
      ]
    });
  return result.toJSON();
};

/**
 * Create a new invoice account in crm_v2.invoice_accounts
 *
 * @param {Object} invoiceAccount An object to persist to crm_v2.invoice_accounts
 * @returns {Object} The created invoice account from the database
 */
const create = async invoiceAccount => helpers.create(InvoiceAccount, invoiceAccount);

exports.findOne = findOne;
exports.findWithCurrentAddress = findWithCurrentAddress;
exports.create = create;
