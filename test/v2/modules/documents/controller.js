const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const controller = require('../../../../src/v2/modules/documents/controller');
const repos = require('../../../../src/v2/connectors/repository');
const uuid = require('uuid/v4');

experiment('v2/modules/documents/controller', () => {
  beforeEach(async () => {
    sandbox.stub(repos.documents, 'findByDocumentRef').resolves([{
      documentId: 'doc_1'
    }, {
      documentId: 'doc_2'
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

  experiment('getDocumentByRefAndDate', () => {
    let request, documentId, documentRef, expectedResponse;

    beforeEach(async () => {
      documentId = uuid();
      documentRef = 'xxyyzz';

      request = {
        query: {
          regime: 'water',
          documentType: 'water_abstraction',
          documentRef: '01/115',
          date: '2007-10-10'
        }
      };

      expectedResponse = {
        documentId,
        documentRef,
        regime: 'water',
        documentType: 'abstraction_licence'
      };

      sandbox.stub(repos.documents, 'findDocumentByRefAndDate').resolves(expectedResponse);

      await controller.getDocumentByRefAndDate(request);
    });

    test('calls repository method with correct arguments', async () => {
      expect(repos.documents.findDocumentByRefAndDate.calledWith(
        request.query.regime,
        request.query.documentType,
        request.query.documentRef,
        request.query.date
      )).to.be.true();
    });
  });

  experiment('getDocumentRolesByDocumentRef', () => {
    let request, documentRef, expectedResponse;

    beforeEach(async () => {
      documentRef = 'xxyyzz';

      request = {
        query: {
          includeHistoricRoles: false
        },
        params: {
          documentRef
        }
      };
      sandbox.stub(repos.documents, 'getDocumentRolesByDocumentRef').resolves([]);
      sandbox.stub(repos.documents, 'getFullHistoryOfDocumentRolesByDocumentRef').resolves([]);
    });

    experiment('when includeHistoricRoles is false', () => {
      beforeEach(async () => {
        await controller.getDocumentRolesByDocumentRef(request);
      });
      test('calls repository method with correct arguments', async () => {
        expect(repos.documents.getDocumentRolesByDocumentRef.calledWith(
          documentRef
        )).to.be.true();
      });
    });

    experiment('when includeHistoricRoles is true', () => {
      beforeEach(async () => {
        request.query.includeHistoricRoles = true;
        await controller.getDocumentRolesByDocumentRef(request);
      });

      test('calls repository method with correct arguments', async () => {
        expect(repos.documents.getFullHistoryOfDocumentRolesByDocumentRef.calledWith(
          documentRef
        )).to.be.true();
      });
    });
  });
});
