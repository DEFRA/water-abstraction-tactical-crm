const queries = require('./queries/invoice-accounts');
const Repository = require('./Repository');

class InvoiceAccountsRepository extends Repository {
  async findManyByIds (ids) {
    return this.findMany(queries.findManyByIds, [ids]);
  }
}

module.exports = InvoiceAccountsRepository;
