const CompaniesRepository = require('./CompaniesRepository');
const ContactsRepository = require('./ContactsRepository');
const DocumentRolesRepository = require('./DocumentRolesRepository');
const DocumentsRepository = require('./DocumentsRepository');

exports.companies = new CompaniesRepository();
exports.contacts = new ContactsRepository();
exports.documents = new DocumentsRepository();
exports.documentRoles = new DocumentRolesRepository();
