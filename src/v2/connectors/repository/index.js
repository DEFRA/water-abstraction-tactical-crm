const DocumentsRepository = require('./DocumentsRepository');
const DocumentRolesRepository = require('./DocumentRolesRepository');
const ContactsRepository = require('./ContactsRepository');

exports.contacts = new ContactsRepository();
exports.documents = new DocumentsRepository();
exports.documentRoles = new DocumentRolesRepository();
exports.invoiceAccounts = require('./invoice-accounts');
