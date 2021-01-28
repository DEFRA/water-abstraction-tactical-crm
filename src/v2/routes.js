'use strict';

module.exports = [
  ...Object.values(require('./modules/addresses/routes')),
  ...Object.values(require('./modules/companies/routes')),
  ...Object.values(require('./modules/contacts/routes')),
  ...Object.values(require('./modules/documents/routes')),
  ...Object.values(require('./modules/invoice-accounts/routes')),
  ...Object.values(require('./modules/invoice-account-addresses/routes')),
  ...Object.values(require('./modules/roles/routes')),
  ...Object.values(require('./modules/test-data/routes'))
];
