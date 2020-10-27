'use strict';

const mapDocumentRole = row => ({
  ...row,
  roleName: row.role.name
});

exports.mapDocumentRole = mapDocumentRole;
