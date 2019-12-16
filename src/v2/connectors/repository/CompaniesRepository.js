const queries = require('./queries/companies');
const Repository = require('./Repository');

class CompaniesRepository extends Repository {
  /**
   * Find all companies for the given invoice account ids
   * @param {Array<String>} invoiceAccountId - Array of ids to search for
   */
  findByInvoiceAccountIds (invoiceAccountIds) {
    return this.findMany(queries.findByInvoiceAccountIds, [invoiceAccountIds]);
  }
}

module.exports = CompaniesRepository;
