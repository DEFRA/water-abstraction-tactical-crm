const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const { pool } = require('../../../../src/v2/connectors/db');

const queries = require('../../../../src/v2/connectors/repository/queries/document-roles');
const DocumentRolesRepository = require('../../../../src/v2/connectors/repository/DocumentRolesRepository');

experiment('DocumentRolesRepository', () => {
  let repo;
  const response = {
    rows: [{ foo: 'bar' }]
  };

  beforeEach(async () => {
    sandbox.stub(pool, 'query').resolves(response);
    repo = new DocumentRolesRepository();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('findByDocumentId', async () => {
    test('calls pool.query with correct query and params', async () => {
      await repo.findByDocumentId('document_1');
      const [query, params] = pool.query.lastCall.args;
      expect(query).to.equal(queries.findByDocumentId);
      expect(params).to.equal(['document_1']);
    });

    test('resolves with row data', async () => {
      const result = await repo.findByDocumentId('document_1');
      expect(result).to.equal(response.rows);
    });
  });
});
