'use strict';

const bookshelf = require('bookshelf');
const { knex } = require('../../../lib/connectors/knex');

// Create instance and register camel case converter
const bookshelfInstance = bookshelf(knex);
bookshelfInstance.plugin('bookshelf-case-converter-plugin');

exports.bookshelf = bookshelfInstance;
