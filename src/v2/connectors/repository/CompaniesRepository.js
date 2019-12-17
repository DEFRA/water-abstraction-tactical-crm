const queries = require('./queries/companies');
const Repository = require('./Repository');

class CompaniesRepository extends Repository {
  /**
   * Find all companies for the given invoice account numbers
   * @param {Array<String>} invoiceAccountNumber - Array of account number strings to search for
   */
  findByInvoiceAccountNumbers (invoiceAccountNumbers) {
    return this.findMany(queries.findByInvoiceAccountNumbers, [invoiceAccountNumbers]);
  }
}

module.exports = CompaniesRepository;
