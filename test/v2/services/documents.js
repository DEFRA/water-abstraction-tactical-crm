'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const uuid = require('uuid/v4');
const { expect, fail } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const errors = require('../../../src/v2/lib/errors');
const documentRolesRepo = require('../../../src/v2/connectors/repository/document-roles');
const rolesRepo = require('../../../src/v2/connectors/repository/roles');
const documentsService = require('../../../src/v2/services/documents');
const documentRepo = require('../../../src/v2/connectors/repository/documents');
const { documentRoles: oldDocRolesRepo } = require('../../../src/v2/connectors/repository');

experiment('services/documents', () => {
  beforeEach(async () => {
    sandbox.stub(documentRolesRepo, 'create');
    sandbox.stub(documentRolesRepo, 'findByDocumentId');
    sandbox.stub(rolesRepo, 'findOneByName').resolves({
      roleId: 'test-role-id'
    });
    sandbox.stub(documentRepo, 'findOne').resolves();
    sandbox.stub(documentRepo, 'findByDocumentRef').resolves();
    sandbox.stub(documentRepo, 'create').resolves();
    sandbox.stub(oldDocRolesRepo, 'findByDocumentId').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.createDocumentRole', () => {
    experiment('when the documentRole data is invalid', () => {
      let documentRole;

      beforeEach(async () => {
        documentRole = {
          role: 'billing',
          invoiceAccountId: uuid()
        };
      });

      test('any EntityValidationError is thrown', async () => {
        const err = await expect(documentsService.createDocumentRole(documentRole))
          .to
          .reject(errors.EntityValidationError, 'Document Role not valid');

        expect(err.validationDetails).to.be.an.array();
      });

      test('the document role is not saved', async () => {
        expect(documentRolesRepo.create.called).to.equal(false);
      });
    });

    experiment('when the documentRole data is valid', async () => {
      let result;
      let documentRole;

      beforeEach(async () => {
        documentRole = {
          documentId: uuid(),
          role: 'billing',
          startDate: '2020-02-01',
          endDate: '2020-03-01',
          invoiceAccountId: uuid(),
          isTest: true
        };

        documentRolesRepo.create.resolves({
          documentRoleId: 'test-id',
          ...documentRole
        });
      });

      experiment('if there are no existing document roles for the document and role', () => {
        beforeEach(async () => {
          documentRolesRepo.findByDocumentId.resolves([]);

          result = await documentsService.createDocumentRole(documentRole);
        });

        test('the document role is saved via the repository', async () => {
          expect(documentRolesRepo.create.called).to.equal(true);
        });

        test('the document role being saved does not have a role property', async () => {
          const [docRole] = documentRolesRepo.create.lastCall.args;
          expect(docRole.role).to.equal(undefined);
        });

        test('the document role have the role id from the roles repo', async () => {
          const [docRole] = documentRolesRepo.create.lastCall.args;
          expect(docRole.roleId).to.equal('test-role-id');
        });

        test('the saved document role is returned', async () => {
          expect(result.documentRoleId).to.equal('test-id');
        });
      });

      experiment('if there are no existing document roles for the document and role type', () => {
        beforeEach(async () => {
          documentRolesRepo.findByDocumentId.resolves([
            {
              documentId: documentRole.documentId,
              role: {
                roleId: uuid(),
                name: 'licenceHolder'
              }
            },
            {
              documentId: documentRole.documentId,
              role: {
                roleId: uuid(),
                name: 'licenceHolder'
              }
            }
          ]);

          result = await documentsService.createDocumentRole(documentRole);
        });

        test('the document role is saved via the repository', async () => {
          expect(documentRolesRepo.create.called).to.equal(true);
        });

        test('the saved document role is returned', async () => {
          expect(result.documentRoleId).to.equal('test-id');
        });
      });

      experiment('if there are existing document roles for the document and role type', () => {
        experiment('and the dates do not overlap', () => {
          beforeEach(async () => {
            documentRolesRepo.findByDocumentId.resolves([
              {
                documentId: documentRole.documentId,
                startDate: new Date(2000, 0, 1),
                endDate: new Date(2001, 0, 1),
                role: {
                  roleId: uuid(),
                  name: 'licenceHolder'
                }
              }
            ]);

            result = await documentsService.createDocumentRole(documentRole);
          });

          test('the document role is saved via the repository', async () => {
            expect(documentRolesRepo.create.called).to.equal(true);
          });

          test('the saved document role is returned', async () => {
            expect(result.documentRoleId).to.equal('test-id');
          });
        });

        experiment('and the dates do overlap', () => {
          // the test data has a start and end date of
          // startDate: '2020-02-01',
          // endDate: '2020-03-01',
          const overlapScenarios = [
            // starts before and ends after incoming data
            { startDate: new Date(2019, 0, 1), endDate: new Date(2022, 1, 2) },
            { startDate: new Date(2019, 0, 1), endDate: null },

            // starts after existing started, but before finished
            { startDate: new Date(2020, 1, 20), endDate: new Date(2022, 1, 2) },
            { startDate: new Date(2020, 1, 20), endDate: null },

            // starts and ends within existing data
            { startDate: new Date(2020, 1, 20), endDate: new Date(2020, 1, 25) }
          ];

          overlapScenarios.forEach(scenario => {
            const { startDate, endDate } = scenario;
            const testName = `throws for start ${startDate} and end ${endDate}`;
            test(testName, async () => {
              const documentRole = {
                startDate: '2020-02-01',
                endDate: '2020-03-01',
                role: 'billing',
                invoiceAccountId: uuid(),
                documentId: uuid()
              };

              documentRolesRepo.findByDocumentId.resolves([
                {
                  documentId: documentRole.documentId,
                  startDate,
                  endDate,
                  role: {
                    roleId: uuid(),
                    name: 'billing'
                  }
                }
              ]);

              const error = await expect(documentsService.createDocumentRole(documentRole)).reject();

              expect(error).to.be.instanceOf(errors.ConflictingDataError);
              expect(error.message).to.equal('Existing document role exists for date range');
            });
          });
        });

        experiment('and the proposed role has no end date and the dates do overlap', () => {
          // the test data has a start and end date of
          // startDate: '2020-02-01',
          // endDate: 'null',
          const overlapScenarios = [
            // starts before and ends after incoming data
            { startDate: new Date(2019, 0, 1), endDate: new Date(2022, 1, 2) },
            { startDate: new Date(2019, 0, 1), endDate: null },

            // starts after existing started, but before finished
            { startDate: new Date(2020, 1, 20), endDate: new Date(2022, 1, 2) },
            { startDate: new Date(2020, 1, 20), endDate: null }
          ];

          overlapScenarios.forEach(scenario => {
            const { startDate, endDate } = scenario;
            const testName = `throws for start ${startDate} and end ${endDate}`;
            test(testName, async () => {
              const documentRole = {
                startDate: '2020-02-01',
                endDate: null,
                role: 'billing',
                invoiceAccountId: uuid(),
                documentId: uuid()
              };

              documentRolesRepo.findByDocumentId.resolves([
                {
                  documentId: documentRole.documentId,
                  startDate,
                  endDate,
                  role: {
                    roleId: uuid(),
                    name: 'billing'
                  }
                }
              ]);

              const error = await expect(documentsService.createDocumentRole(documentRole)).reject();

              expect(error).to.be.instanceOf(errors.ConflictingDataError);
              expect(error.message).to.equal('Existing document role exists for date range');
            });
          });
        });
      });
    });
  });

  experiment('getDocument', () => {
    let request, response;

    experiment('when document is not found', () => {
      beforeEach(async () => {
        documentRepo.findOne.resolves();
        request = {
          params: {
            documentId: 'doc_1'
          }
        };
      });

      test('throws a Boom 404 error', async () => {
        try {
          await documentsService.getDocument(request);
          fail();
        } catch (err) {
          expect(err.isBoom).to.be.true();
          expect(err.output.statusCode).to.equal(404);
        }
      });
    });

    experiment('when document is found', () => {
      let documentId;
      beforeEach(async () => {
        documentId = 'doc_1';
        documentRepo.findOne.resolves({
          documentId: 'doc_1'
        });
        oldDocRolesRepo.findByDocumentId.resolves([{
          document_id: 'doc_1'
        }, {
          document_id: 'doc_2'
        }]);

        response = await documentsService.getDocument(documentId);
      });

      test('calls repository methods with correct arguments', async () => {
        expect(documentRepo.findOne.calledWith(documentId)).to.be.true();
        expect(oldDocRolesRepo.findByDocumentId.calledWith(documentId)).to.be.true();
      });

      test('responds with mapped object', async () => {
        expect(response.documentId).to.equal(documentId);
        expect(response.documentRoles).to.be.an.array();
      });
    });
  });

  experiment('.getDocumentsByRef', () => {
    let result;

    beforeEach(async () => {
      const regime = 'water';
      const documentType = 'water_abstraction';
      const documentRef = '01/115';

      await documentRepo.findByDocumentRef.resolves([{
        documentId: 'doc_1'
      }, {
        documentId: 'doc_2'
      }]);

      result = await documentsService.getDocumentsByRef(regime, documentType, documentRef);
    });

    test('calls repository method with correct arguments', async () => {
      expect(documentRepo.findByDocumentRef.calledWith(
        'water',
        'water_abstraction',
        '01/115'
      )).to.be.true();
    });

    test('resolves with mapped response', async () => {
      expect(result).to.equal([{
        documentId: 'doc_1'
      }, {
        documentId: 'doc_2'
      }]);
    });
  });

  experiment('.getDocumentByRefAndDate', () => {
    const regime = 'water';
    const documentType = 'abstraction_licence';
    const date = '2000-01-01';
    const UUIDRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    experiment('when the document exists', () => {
      const documentRef = '01/115';
      let response;
      beforeEach(async () => {
        await sandbox.stub(documentsService, 'getDocumentByRefAndDate').resolves({
          documentId: uuid(),
          documentRef: documentRef,
          companyId: uuid()
        });

        response = await documentsService.getDocumentByRefAndDate(regime, documentType, documentRef, date);
      });

      test('responds with a single row', async () => {
        expect(typeof response).to.equal('object');
      });

      test('responds with a company GUID', async () => {
        expect(typeof response.companyId).to.equal('string');
        expect(response.companyId).to.match(UUIDRegExp);
      });
    });
  });

  experiment('.createDocument', () => {
    experiment('when the document data is invalid', () => {
      let document;

      beforeEach(async () => {
        document = {
          regime: 'water'
        };
      });

      test('any EntityValidationError is thrown', async () => {
        const err = await expect(documentsService.createDocument(document))
          .to
          .reject(errors.EntityValidationError, 'Document not valid');

        expect(err.validationDetails).to.be.an.array();
      });

      test('the document is not saved', async () => {
        expect(documentRepo.create.called).to.equal(false);
      });
    });

    experiment('when the document data is valid', async () => {
      let result;
      let document;

      beforeEach(async () => {
        document = {
          regime: 'water',
          documentType: 'abstraction_licence',
          versionNumber: 100,
          documentRef: 'doc-ref',
          status: 'current',
          startDate: '2000-01-13',
          endDate: '2010-01-18',
          isTest: true
        };
        documentRepo.findByDocumentRef.resolves([]);

        documentRepo.create.resolves({ documentId: 'test-id' });
        result = await documentsService.createDocument(document);
      });

      test('the document is saved via the repository', async () => {
        expect(documentRepo.create.called).to.equal(true);
      });

      test('the document has the id from the documents repo', async () => {
        expect(result.documentId).to.equal('test-id');
      });

      test('the saved document is returned', async () => {
        expect(result.documentId).to.equal('test-id');
      });

      experiment('and the dates do overlap', () => {
        // the test data has a start and end date of
        // startDate: '2000-01-13',
        // endDate: '2010-01-18',
        const overlapScenarios = [
          // existing documents starts before the new document
          { startDate: new Date(1999, 1, 1), endDate: new Date(2020, 1, 2) },
          { startDate: new Date(1999, 1, 1), endDate: null },

          // existing document starts after new document
          { startDate: new Date(2001, 1, 20), endDate: new Date(2009, 1, 2) },
          { startDate: new Date(2002, 1, 20), endDate: null },

          // existing document starts after and ends before the new document
          { startDate: new Date(2002, 1, 20), endDate: new Date(2003, 1, 25) }
        ];

        overlapScenarios.forEach(scenario => {
          const { startDate, endDate } = scenario;
          const testName = `throws for start ${startDate} and end ${endDate}`;
          test(testName, async () => {
            document = {
              regime: 'water',
              documentType: 'abstraction_licence',
              versionNumber: 100,
              documentRef: 'doc-ref',
              status: 'current',
              startDate: '2000-01-13',
              endDate: '2010-01-18'
            };

            documentRepo.findByDocumentRef.resolves([
              {
                documentId: uuid(),
                regime: 'water',
                documentType: 'abstraction_licence',
                versionNumber: 102,
                documentRef: 'doc-ref',
                status: 'current',
                startDate,
                endDate
              }
            ]);

            const error = await expect(documentsService.createDocument(document)).reject();
            console.log(error);
            expect(error).to.be.instanceOf(errors.ConflictingDataError);
            expect(error.message).to.equal('Overlapping start and end date for document');
          });
        });
      });

      experiment('and the dates do overlap where the new document endDate is null', () => {
        // the new document to be created has a start and end date of
        // startDate: '2000-01-13',
        // endDate: null,
        const overlapScenarios = [
          // existing documents starts before the new document
          { startDate: new Date(1999, 1, 1), endDate: new Date(2020, 1, 2) },
          { startDate: new Date(1999, 1, 1), endDate: null },

          // existing document starts after new document
          { startDate: new Date(2001, 1, 20), endDate: new Date(2009, 1, 2) },
          { startDate: new Date(2002, 1, 20), endDate: null },

          // existing document starts after and ends before the new document
          { startDate: new Date(2002, 1, 20), endDate: new Date(2003, 1, 25) }
        ];

        overlapScenarios.forEach(scenario => {
          const { startDate, endDate } = scenario;
          const testName = `throws for start ${startDate} and end ${endDate}`;
          test(testName, async () => {
            document = {
              regime: 'water',
              documentType: 'abstraction_licence',
              versionNumber: 100,
              documentRef: 'doc-ref',
              status: 'current',
              startDate: '2000-01-13',
              endDate: null
            };

            documentRepo.findByDocumentRef.resolves([
              {
                documentId: uuid(),
                regime: 'water',
                documentType: 'abstraction_licence',
                versionNumber: 102,
                documentRef: 'doc-ref',
                status: 'current',
                startDate,
                endDate
              }
            ]);

            const error = await expect(documentsService.createDocument(document)).reject();
            expect(error).to.be.instanceOf(errors.ConflictingDataError);
            expect(error.message).to.equal('Overlapping start and end date for document');
          });
        });
      });
    });
  });
});
