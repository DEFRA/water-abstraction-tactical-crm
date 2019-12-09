const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const ContactsRepository = require('../../../../src/v2/connectors/repository/ContactsRepository');
const db = require('../../../../src/lib/connectors/db');
const queries = require('../../../../src/v2/connectors/repository/queries/contacts');

experiment('v2/connectors/repository/ContactsRepository', () => {
  beforeEach(async () => {
    sandbox.stub(db.pool, 'query').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.findOneById', () => {
    let result;

    beforeEach(async () => {
      db.pool.query.resolves({
        rows: [
          { contact_id: 'test-contact-id' }
        ]
      });

      const repo = new ContactsRepository();
      result = await repo.findOneById('test-contact-id');
    });

    test('uses the expected query', async () => {
      const [query] = db.pool.query.lastCall.args;
      expect(query).to.equal(queries.findOneById);
    });

    test('passes the contact id as the query params', async () => {
      const [, params] = db.pool.query.lastCall.args;
      expect(params).to.equal(['test-contact-id']);
    });

    test('returns the row returned from the database', async () => {
      expect(result).to.equal({
        contact_id: 'test-contact-id'
      });
    });
  });

  experiment('.findManyById', () => {
    let result;

    beforeEach(async () => {
      db.pool.query.resolves({
        rows: [
          { contact_id: 'test-contact-id-1' },
          { contact_id: 'test-contact-id-2' }
        ]
      });

      const repo = new ContactsRepository();
      result = await repo.findManyById([
        'test-contact-id-1',
        'test-contact-id-2'
      ]);
    });

    test('uses the expected query', async () => {
      const [query] = db.pool.query.lastCall.args;
      expect(query).to.equal(queries.findManyById);
    });

    test('passes the contact ids as the query params', async () => {
      const [, params] = db.pool.query.lastCall.args;
      expect(params).to.equal([
        [
          'test-contact-id-1',
          'test-contact-id-2'
        ]
      ]);
    });

    test('returns the rows returned from the database', async () => {
      expect(result).to.equal([
        { contact_id: 'test-contact-id-1' },
        { contact_id: 'test-contact-id-2' }
      ]);
    });
  });
});
