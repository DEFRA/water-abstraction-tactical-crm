const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const { pool } = require('../../../../src/v2/connectors/db');

const queries = require('../../../../src/v2/connectors/repository/queries/documents');
const DocumentsRepository = require('../../../../src/v2/connectors/repository/DocumentsRepository');

experiment('DocumentsRepository', () => {
  let repo;
  const response = {
    rows: [{ foo: 'bar' }]
  };

  beforeEach(async () => {
    sandbox.stub(pool, 'query').resolves(response);
    repo = new DocumentsRepository();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('findOneById', async () => {
    test('calls pool.query with correct query and params', async () => {
      await repo.findOneById('document_1');
      const [query, params] = pool.query.lastCall.args;
      expect(query).to.equal(queries.findOneById);
      expect(params).to.equal(['document_1']);
    });

    test('resolves with single row data', async () => {
      const result = await repo.findOneById('document_1');
      expect(result).to.equal(response.rows[0]);
    });
  });

  experiment('findByDocumentRef', async () => {
    test('calls pool.query with correct query and params', async () => {
      await repo.findByDocumentRef('water', 'abstraction_licence', 'doc_1');
      const [query, params] = pool.query.lastCall.args;
      expect(query).to.equal(queries.findByDocumentRef);
      expect(params).to.equal(['water', 'abstraction_licence', 'doc_1']);
    });

    test('resolves with row data', async () => {
      const result = await repo.findByDocumentRef('document_1');
      expect(result).to.equal(response.rows);
    });
  });
});
