'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const documentRepo = require('../../../../src/v2/connectors/repository/documents');
const Document = require('../../../../src/v2/connectors/bookshelf/Document');
const documentsRepo = require('../../../../src/v2/connectors/repository/documents');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/documents', () => {
  let stub, model;

  beforeEach(async () => {
    model = {
      toJSON: sandbox.stub().returns({ id: 'test-id' })
    };

    stub = {
      save: sandbox.stub().resolves(model),
      fetch: sandbox.stub().resolves(model)
    };

    sandbox.stub(Document, 'forge').returns(stub);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.create', () => {
    let result;
    let document;

    beforeEach(async () => {
      document = { document1: 'test one', postcode: 'BS1 1SB' };
      result = await documentRepo.create(document);
    });

    test('.forge() is called on the model with the data', async () => {
      const [data] = Document.forge.lastCall.args;
      expect(data).to.equal(document);
    });

    test('.save() is called after the forge', async () => {
      expect(stub.save.called).to.equal(true);
    });

    test('the JSON representation is returned', async () => {
      expect(model.toJSON.called).to.be.true();
      expect(result.id).to.equal('test-id');
    });
  });

  experiment('.findOne', () => {
    let result;

    experiment('when the id matches a document', () => {
      beforeEach(async () => {
        result = await documentRepo.findOne('test-id');
      });

      test('.forge() is called on the model with the data', async () => {
        const [data] = Document.forge.lastCall.args;
        expect(data).to.equal({ documentId: 'test-id' });
      });

      test('.fetch() is called after the forge', async () => {
        expect(stub.fetch.called).to.equal(true);
      });

      test('the JSON representation is returned', async () => {
        expect(model.toJSON.called).to.be.true();
        expect(result.id).to.equal('test-id');
      });
    });

    experiment('when the id does not find a document', () => {
      beforeEach(async () => {
        stub.fetch.resolves(null);
        result = await documentRepo.findOne('test-id');
      });

      test('.forge() is called on the model with the data', async () => {
        const [data] = Document.forge.lastCall.args;
        expect(data).to.equal({ documentId: 'test-id' });
      });

      test('.fetch() is called after the forge', async () => {
        expect(stub.fetch.called).to.equal(true);
      });

      test('null is returned', async () => {
        expect(result).to.equal(null);
      });
    });
  });
});

experiment('v2/connectors/repository/document-roles', () => {
  beforeEach(async () => {
    sandbox.stub(repoHelpers, 'deleteTestData');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.deleteTestData', () => {
    test('is created using the helpers', async () => {
      await documentsRepo.deleteTestData();

      const [model] = repoHelpers.deleteTestData.lastCall.args;
      expect(model).to.equal(Document);
    });
  });
});
