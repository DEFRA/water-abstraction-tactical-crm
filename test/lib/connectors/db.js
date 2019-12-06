'use strict';

require('dotenv').config();

const { expect } = require('@hapi/code');
const { experiment, test } = exports.lab = require('@hapi/lab').script();

const db = require('../../../src/lib/connectors/db.js');

experiment('result object', () => {
  test('has data when no error', async () => {
    const res = await db.query('select 1 as test_one');
    expect(res).to.equal({
      data: [
        { test_one: 1 }
      ],
      error: null
    });
  });

  test('has error details when an error occurs', async () => {
    const query = `
   select 1
   from non_existent_schema.non_existent_table;`;

    const res = await db.query(query);
    expect(res.data).to.be.null();
    expect(res.error).not.to.be.null();
  });

  test('returns dates in format YYYY-MM-DD', async () => {
    const query = "select date '2001-10-01'";
    const { rows } = await db.pool.query(query);
    expect(rows[0].date).to.equal('2001-10-01');
  });
});
