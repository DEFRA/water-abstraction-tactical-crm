const queries = require('./queries/contacts');
const Repository = require('./Repository');

class ContactsRepository extends Repository {
  /**
   * Find a single contact record by its id
   * @param {String} contactId - GUID
   */
  async findOneById (contactId) {
    return this.findOne(queries.findOneById, [contactId]);
  }

  async findManyById (contactIds) {
    return this.findMany(queries.findManyById, [contactIds]);
  }
}

module.exports = ContactsRepository;
