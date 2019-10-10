const DocumentsRepository = require('./DocumentsRepository');
const DocumentRolesRepository = require('./DocumentRolesRepository');

exports.documents = new DocumentsRepository();
exports.documentRoles = new DocumentRolesRepository();
