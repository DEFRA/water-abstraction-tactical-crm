'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const documentRepo = require('../../../src/v2/connectors/repository/documents');
const documentService = require('../../../src/v2/services/documents');

experiment('v2/services/document', () => {
  beforeEach(async () => {
    sandbox.stub(documentRepo, 'create').resolves();
    sandbox.stub(documentRepo, 'findByDocumentRef').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  const document = {
    regime: 'water',
    documentType: 'abstraction_licence',
    versionNumber: 100,
    documentRef: 'doc-ref',
    status: 'current',
    startDate: '2001-01-18',
    endDate: '2010-01-17',
    isTest: true
  };

  experiment('.createDocument', () => {
    experiment('for an invalid document', () => {
      let err;

      beforeEach(async () => {
        try {
          await documentService.createDocument({});
        } catch (error) {
          err = error;
        }
      });

      test('does not create the document at the database', async () => {
        expect(documentRepo.create.called).to.equal(false);
      });

      test('throws an error containing the validation messages', async () => {
        expect(err.message).to.equal('Document not valid');
        expect(err.validationDetails).to.include('"regime" is required');
      });
    });

    experiment('for a valid document', () => {
      let result;

      beforeEach(async () => {
        documentRepo.create.resolves({
          documentId: 'test-document-id'
        });

        documentRepo.findByDocumentRef.resolves([]);

        result = await documentService.createDocument(document);
      });

      test('includes the saved document in the response', async () => {
        expect(result.documentId).to.equal('test-document-id');
      });
      test('calls the findByDocumentRef with correct regime, doc type and doc ref', async () => {
        expect(documentRepo.findByDocumentRef.lastCall.args).to.equal(['water', 'abstraction_licence', 'doc-ref']);
      });
    });

    experiment('for an invalid document', () => {
      let err;

      beforeEach(async () => {
        documentRepo.findByDocumentRef.resolves([{
          ...document,
          startDate: '2000-01-16',
          endDate: null
        }]);

        try {
          await documentService.createDocument(document);
        } catch (error) {
          err = error;
        }
      });

      test('does not create the document at the database', async () => {
        expect(documentRepo.create.called).to.equal(false);
      });

      test('throws an error containing the validation messages', async () => {
        expect(err.name).to.equal('UniqueConstraintViolation');
        expect(err.message).to.equal('Overlapping start and end date for document reference: doc-ref');
      });
    });
  });
});
