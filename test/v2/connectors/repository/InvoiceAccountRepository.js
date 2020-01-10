const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const InvoiceAccountsRepository = require('../../../../src/v2/connectors/repository/InvoiceAccountsRepository');
const db = require('../../../../src/lib/connectors/db');
const queries = require('../../../../src/v2/connectors/repository/queries/invoice-accounts');

experiment('v2/connectors/repository/InvoiceAccountsRepository', () => {
  beforeEach(async () => {
    sandbox.stub(db.pool, 'query').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.findManyByIds', () => {
    let result;

    beforeEach(async () => {
      db.pool.query.resolves({
        rows: [
          { invoice_account_id: 'test-id' }
        ]
      });

      const repo = new InvoiceAccountsRepository();
      result = await repo.findManyByIds('test-id');
    });

    test('uses the expected query', async () => {
      const [query] = db.pool.query.lastCall.args;
      expect(query).to.equal(queries.findManyByIds);
    });

    test('passes the invoice account id as the query params', async () => {
      const [, params] = db.pool.query.lastCall.args;
      expect(params).to.equal(['test-id']);
    });

    test('returns the rows returned from the database', async () => {
      expect(result).to.equal([
        { invoice_account_id: 'test-id' }
      ]);
    });
  });

  experiment('.findOneById', () => {
    let result;

    beforeEach(async () => {
      db.pool.query.resolves({
        rows: [
          { invoice_account_id: 'test-id' }
        ]
      });

      const repo = new InvoiceAccountsRepository();
      result = await repo.findOneById('test-id');
    });

    test('uses the expected query', async () => {
      const [query] = db.pool.query.lastCall.args;
      expect(query).to.equal(queries.findOneById);
    });

    test('passes the invoice account id as the query params', async () => {
      const [, params] = db.pool.query.lastCall.args;
      expect(params).to.equal(['test-id']);
    });

    test('returns the row returned from the database', async () => {
      expect(result).to.equal(
        { invoice_account_id: 'test-id' }
      );
    });
  });
});
