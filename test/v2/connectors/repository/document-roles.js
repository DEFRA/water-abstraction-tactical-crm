'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const uuid = require('uuid/v4');
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const documentRolesRepo = require('../../../../src/v2/connectors/repository/document-roles');
const DocumentRole = require('../../../../src/v2/connectors/bookshelf/DocumentRole');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/document-roles', () => {
  beforeEach(async () => {
    sandbox.stub(repoHelpers, 'create').resolves('create-response');
    sandbox.stub(repoHelpers, 'findOne').resolves('find-one-response');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.create', () => {
    let documentRole;
    let result;

    beforeEach(async () => {
      result = await documentRolesRepo.create(documentRole);
    });

    test('uses the repository helpers create function', async () => {
      const [model, data] = repoHelpers.create.lastCall.args;

      expect(model).to.equal(DocumentRole);
      expect(data).to.equal(documentRole);
    });

    test('returns the data from the helper', async () => {
      expect(result).to.equal('create-response');
    });
  });

  experiment('.findOne', () => {
    let documentRoleId;
    let result;

    beforeEach(async () => {
      documentRoleId = 'test-id';
      result = await documentRolesRepo.findOne(documentRoleId);
    });

    test('uses the repository helpers findOne function', async () => {
      const [model, idKey, id] = repoHelpers.findOne.lastCall.args;

      expect(model).to.equal(DocumentRole);
      expect(idKey).to.equal('documentRoleId');
      expect(id).to.equal('test-id');
    });

    test('returns the data from the helper', async () => {
      expect(result).to.equal('find-one-response');
    });
  });

  experiment('.findByDocumentId', () => {
    let stub;

    beforeEach(async () => {
      stub = {
        where: sandbox.stub().returnsThis(),
        fetch: sandbox.stub().resolves({
          toJSON: () => 'test-data'
        })
      };

      sandbox.stub(DocumentRole, 'collection').returns(stub);
    });

    test('queries using the supplied document id', async () => {
      const documentId = uuid();
      await documentRolesRepo.findByDocumentId(documentId);

      const [params] = stub.where.lastCall.args;
      expect(params).to.equal({
        document_id: documentId
      });
    });

    test('adds the role to the response', async () => {
      const documentId = uuid();
      await documentRolesRepo.findByDocumentId(documentId);

      const [options] = stub.fetch.lastCall.args;

      expect(options.withRelated).to.equal(['role']);
    });
  });
});
