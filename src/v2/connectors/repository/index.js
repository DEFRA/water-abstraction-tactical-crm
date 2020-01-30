const DocumentsRepository = require('./DocumentsRepository');
const DocumentRolesRepository = require('./DocumentRolesRepository');
const ContactsRepository = require('./ContactsRepository');
const InvoiceAccountsRepository = require('./InvoiceAccountsRepository');

exports.contacts = new ContactsRepository();
exports.documents = new DocumentsRepository();
exports.documentRoles = new DocumentRolesRepository();
exports.invoiceAccounts = new InvoiceAccountsRepository();
