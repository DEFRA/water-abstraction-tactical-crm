module.exports = [
  ...Object.values(require('./modules/contacts/routes')),
  ...Object.values(require('./modules/documents/routes'))
];
