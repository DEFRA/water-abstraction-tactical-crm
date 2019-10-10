const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect, fail } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const controller = require('../../../../src/v2/modules/documents/controller');
const repos = require('../../../../src/v2/connectors/repository');

experiment('v2/modules/documents/controller', () => {
  beforeEach(async () => {
    sandbox.stub(repos.documents, 'findByDocumentRef').resolves([{
      document_id: 'doc_1'
    }, {
      document_id: 'doc_2'
    }]);
    sandbox.stub(repos.documents, 'findOneById').resolves({
      document_id: 'doc_1'
    });
    sandbox.stub(repos.documentRoles, 'findByDocumentId').resolves([{
      document_id: 'doc_1'
    }, {
      document_id: 'doc_2'
    }]);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('getDocuments', () => {
    let request, response;

    beforeEach(async () => {
      request = {
        query: {
          regime: 'water',
          documentType: 'water_abstraction',
          documentRef: '01/115'
        }
      };
      response = await controller.getDocuments(request);
    });

    test('calls repository method with correct arguments', async () => {
      expect(repos.documents.findByDocumentRef.calledWith(
        request.query.regime,
        request.query.documentType,
        request.query.documentRef
      )).to.be.true();
    });

    test('resolves with mapped response', async () => {
      expect(response).to.equal([{
        documentId: 'doc_1'
      }, {
        documentId: 'doc_2'
      }]);
    });
  });

  experiment('getDocument', () => {
    let request, response;

    experiment('when document is not found', () => {
      beforeEach(async () => {
        repos.documents.findOneById.resolves();
        request = {
          params: {
            documentId: 'doc_1'
          }
        };
      });

      test('throws a Boom 404 error', async () => {
        try {
          await controller.getDocument(request);
          fail();
        } catch (err) {
          expect(err.isBoom).to.be.true();
          expect(err.output.statusCode).to.equal(404);
        }
      });
    });

    experiment('when document is found', () => {
      beforeEach(async () => {
        request = {
          params: {
            documentId: 'doc_1'
          }
        };
        response = await controller.getDocument(request);
      });

      test('calls repository methods with correct arguments', async () => {
        expect(repos.documents.findOneById.calledWith(
          request.params.documentId
        )).to.be.true();
        expect(repos.documentRoles.findByDocumentId.calledWith(
          request.params.documentId
        )).to.be.true();
      });

      test('responds with mapped object', async () => {
        expect(response.documentId).to.equal(request.params.documentId);
        expect(response.documentRoles).to.be.an.array();
      });
    });
  });
});
