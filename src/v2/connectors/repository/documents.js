'use strict';

const Document = require('../bookshelf/Document');
const helpers = require('./helpers');

const deleteTestData = async () => helpers.deleteTestData(Document);

exports.deleteTestData = deleteTestData;
