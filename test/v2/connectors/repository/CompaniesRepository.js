const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const CompaniesRepository = require('../../../../src/v2/connectors/repository/CompaniesRepository');
const db = require('../../../../src/lib/connectors/db');
const queries = require('../../../../src/v2/connectors/repository/queries/companies');

experiment('v2/connectors/repository/CompaniesRepository', () => {
  beforeEach(async () => {
    sandbox.stub(db.pool, 'query').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.findByInvoiceAccountNumbers', () => {
    let result;

    beforeEach(async () => {
      db.pool.query.resolves({
        rows: [
          { company_id: 'test-company-id-1' },
          { company_id: 'test-company-id-2' }
        ]
      });

      const repo = new CompaniesRepository();
      result = await repo.findByInvoiceAccountNumbers([
        '1TESTTEST1',
        '2TESTTEST2'
      ]);
    });

    test('uses the expected query', async () => {
      const [query] = db.pool.query.lastCall.args;
      expect(query).to.equal(queries.findByInvoiceAccountNumbers);
    });

    test('passes the invoice account numbers as the query params', async () => {
      const [, params] = db.pool.query.lastCall.args;
      expect(params).to.equal([
        [
          '1TESTTEST1',
          '2TESTTEST2'
        ]
      ]);
    });

    test('returns the rows returned from the database', async () => {
      expect(result).to.equal([
        { company_id: 'test-company-id-1' },
        { company_id: 'test-company-id-2' }
      ]);
    });
  });
});
