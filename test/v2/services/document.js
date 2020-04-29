'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const errors = require('../../../src/v2/lib/errors');
const documentRolesRepo = require('../../../src/v2/connectors/repository/document-roles');
const rolesRepo = require('../../../src/v2/connectors/repository/roles');
const documentsService = require('../../../src/v2/services/documents');
const documentRepo = require('../../../src/v2/connectors/repository/documents');

experiment('v2/services/document', () => {
  beforeEach(async () => {
    const { expect } = require('@hapi/code');
    const sandbox = require('sinon').createSandbox();
    sandbox.stub(documentRepo, 'create').resolves();
    sandbox.stub(documentRepo, 'findByDocumentRef').resolves();
    const uuid = require('uuid/v4');

    experiment('services/documents', () => {
      beforeEach(async () => {
        sandbox.stub(documentRolesRepo, 'create');
        sandbox.stub(documentRolesRepo, 'findByDocumentId');
        sandbox.stub(rolesRepo, 'findOneByName').resolves({
          roleId: 'test-role-id'
        });
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
              await documentsService.createDocument({});
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

            result = await documentsService.createDocument(document);
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
              await documentsService.createDocument(document);
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
    });
  });
});
