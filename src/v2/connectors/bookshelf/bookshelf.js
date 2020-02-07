const bookshelf = require('bookshelf');
const config = require('../../../../config.js');

// Setting up the database connection
const knex = require('knex')({
  client: 'pg',
  connection: config.pg.connectionString,
  searchPath: ['crm_v2'],
  pool: { min: 0, max: 1 }
});

// Create instance and register camel case converter
const bookshelfInstance = bookshelf(knex);
bookshelfInstance.plugin('bookshelf-case-converter-plugin');

exports.bookshelf = bookshelfInstance;