'use strict';

require('dotenv').config();

const { expect } = require('@hapi/code');
const { experiment, test } = exports.lab = require('@hapi/lab').script();

const { pool } = require('../../../src/lib/connectors/db.js');

experiment('lib/connectors/db', () => {
  test('pool is an object', async () => {
    expect(pool).to.be.an.object();
  });
});
