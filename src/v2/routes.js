module.exports = [
  ...Object.values(require('./modules/contacts/routes')),
  ...Object.values(require('./modules/companies/routes')),
  ...Object.values(require('./modules/documents/routes'))
];
