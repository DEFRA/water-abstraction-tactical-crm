'use-strict';
const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const repos = require('../../../src/lib/repo/kpi-reporting');
const { pool } = require('../../../src/lib/connectors/db');

experiment('./lib/repo/kpi-reporting', () => {
  beforeEach(async => {
    sandbox.stub(pool, 'query').resolves({ rows: [], error: null });
  });

  afterEach(async => {
    sandbox.restore();
  });

  const query = "SELECT date_part('month', created_at)::integer AS month,\n" +
  "    date_part('year', created_at)::integer as year,\n" +
  '    COUNT(entity_id)::integer AS total,\n' +
  "    date_part('year', created_at) = date_part('year', CURRENT_DATE) AS current_year\n" +
  '    FROM\n' +
  "       (SELECT distinct entity_id, created_at FROM crm.entity_roles where role <> 'primary_user') AS tbl\n" +
  '       GROUP BY month, current_year, year;';

  test('the correct params are used to call db pool query', async () => {
    await repos.getEntityRolesKPIdata();
    expect(pool.query.lastCall.args[0]).to.be.equal(query);
    expect(pool.query.lastCall.args.length).to.be.equal(1);
  });

  test('the correct data shape is returned', async () => {
    const response = await repos.getEntityRolesKPIdata();
    expect(response).to.equal({ data: [], error: null });
  });
});
